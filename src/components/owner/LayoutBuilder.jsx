import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  LayoutGrid,
  ArrowLeft,
  AlertCircle,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';
import { createLayout } from '@/api/services/layoutService';

const SEAT_TYPES = {
  SILVER: { label: 'Silver', bgColor: '#6b7280', textColor: '#ffffff' },
  GOLD: { label: 'Gold', bgColor: '#eab308', textColor: '#000000' },
  PLATINUM: { label: 'Platinum', bgColor: '#a855f7', textColor: '#ffffff' },
  DIAMOND: { label: 'Diamond', bgColor: '#22d3ee', textColor: '#000000' }
};

const CELL_TYPES = {
  SEAT: 'SEAT',
  SPACE: 'SPACE'
};

export default function LayoutBuilder({
  screenId = null,
  screenName = null,
  createdBy,
  onSuccess = () => {},
  onBack = () => {}
}) {
  const [layoutName, setLayoutName] = useState('');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(12);
  const [selectedSeatType, setSelectedSeatType] = useState('SILVER');
  const [grid, setGrid] = useState(() => generateInitialGrid(8, 12));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function generateInitialGrid(numRows, numCols) {
    return Array.from({ length: numRows }, (_, r) => {
      const rowLabel = String.fromCharCode(65 + r);
      return {
        rowIndex: r,
        rowLabel,
        cells: Array.from({ length: numCols }, (_, c) => ({
          col: c,
          type: CELL_TYPES.SEAT,
          seatNo: `${rowLabel}${c + 1}`,
          seatType: 'SILVER',
          label: `${rowLabel}${c + 1}`
        }))
      };
    });
  }

  const handleDimensionChange = (newRows, newCols) => {
    if (newRows < 1 || newRows > 26 || newCols < 1 || newCols > 30) return;
    setRows(newRows);
    setCols(newCols);
    setGrid(generateInitialGrid(newRows, newCols));
  };

  const toggleCell = (rowIndex, colIndex) => {
    setGrid(prev =>
      prev.map((row, rIdx) =>
        rIdx !== rowIndex
          ? row
          : {
              ...row,
              cells: row.cells.map((cell, cIdx) => {
                if (cIdx !== colIndex) return cell;
                return cell.type === CELL_TYPES.SEAT
                  ? { ...cell, type: CELL_TYPES.SPACE, seatNo: null, seatType: null, label: '' }
                  : {
                      ...cell,
                      type: CELL_TYPES.SEAT,
                      seatNo: `${row.rowLabel}${cIdx + 1}`,
                      seatType: selectedSeatType,
                      label: `${row.rowLabel}${cIdx + 1}`
                    };
              })
            }
      )
    );
  };

  const changeSeatType = (rowIndex, colIndex) => {
    setGrid(prev =>
      prev.map((row, rIdx) =>
        rIdx !== rowIndex
          ? row
          : {
              ...row,
              cells: row.cells.map((cell, cIdx) =>
                cIdx === colIndex && cell.type === CELL_TYPES.SEAT
                  ? { ...cell, seatType: selectedSeatType }
                  : cell
              )
            }
      )
    );
  };

  const applyTypeToRow = rowIndex => {
    setGrid(prev =>
      prev.map((row, rIdx) =>
        rIdx !== rowIndex
          ? row
          : {
              ...row,
              cells: row.cells.map(cell =>
                cell.type === CELL_TYPES.SEAT
                  ? { ...cell, seatType: selectedSeatType }
                  : cell
              )
            }
      )
    );
  };

  const resetGrid = () => setGrid(generateInitialGrid(rows, cols));

  const stats = useMemo(() => {
    const seatCounts = { SILVER: 0, GOLD: 0, PLATINUM: 0, DIAMOND: 0 };
    let totalSeats = 0;

    grid.forEach(row =>
      row.cells.forEach(cell => {
        if (cell.type === CELL_TYPES.SEAT) {
          totalSeats++;
          seatCounts[cell.seatType]++;
        }
      })
    );

    return { totalSeats, seatCounts };
  }, [grid]);

  const validateForm = () => {
    if (!layoutName.trim()) return setError('Layout name is required'), false;
    if (layoutName.trim().length < 3)
      return setError('Layout name must be at least 3 characters'), false;
    if (stats.totalSeats === 0)
      return setError('Layout must have at least one seat'), false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        screenId,
        layoutName: layoutName.trim(),
        rows: grid,
        totalRows: rows,
        totalColumns: cols,
        totalSeats: stats.totalSeats,
        description: description.trim() || null,
        createdBy
      };

      const response = await createLayout(payload);
      onSuccess(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create layout');
    } finally {
      setLoading(false);
    }
  };

  const isReusableLayout = !screenId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <LayoutGrid className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">
            {isReusableLayout ? 'Create Reusable Layout Template' : 'Create Seat Layout'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isReusableLayout
              ? 'Reusable across all screens'
              : <>Screen: <span className="text-primary">{screenName}</span></>}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Layout Name *</Label>
          <Input value={layoutName} onChange={e => setLayoutName(e.target.value)} />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>

      {/* Dimensions */}
      <div className="flex gap-4 items-center">
        <Label>Rows</Label>
        <Button size="sm" onClick={() => handleDimensionChange(rows - 1, cols)}><Minus /></Button>
        {rows}
        <Button size="sm" onClick={() => handleDimensionChange(rows + 1, cols)}><Plus /></Button>

        <Label>Cols</Label>
        <Button size="sm" onClick={() => handleDimensionChange(rows, cols - 1)}><Minus /></Button>
        {cols}
        <Button size="sm" onClick={() => handleDimensionChange(rows, cols + 1)}><Plus /></Button>

        <Button variant="ghost" onClick={resetGrid}><RotateCcw /> Reset</Button>
      </div>

      {/* Seat Type */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(SEAT_TYPES).map(([key, cfg]) => (
          <Button
            key={key}
            size="sm"
            onClick={() => setSelectedSeatType(key)}
            style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}
          >
            {cfg.label}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="flex items-center gap-1 mb-1">
            <span className="w-6 text-xs">{row.rowLabel}</span>
            {row.cells.map((cell, cIdx) => (
              <button
                key={cIdx}
                onClick={() => toggleCell(rIdx, cIdx)}
                onContextMenu={e => {
                  e.preventDefault();
                  changeSeatType(rIdx, cIdx);
                }}
                className="w-8 h-8 text-xs rounded"
                style={
                  cell.type === CELL_TYPES.SEAT
                    ? {
                        backgroundColor: SEAT_TYPES[cell.seatType].bgColor,
                        color: SEAT_TYPES[cell.seatType].textColor
                      }
                    : { border: '1px dashed #999' }
                }
              >
                {cell.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : 'Save Layout'}
        </Button>
      </div>
    </div>
  );
}
