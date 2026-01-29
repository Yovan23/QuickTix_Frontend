// Generate shows for the next 3 days
const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 3; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push(date.toISOString().split('T')[0])
    }
    return dates
}

const theaters = [
    { id: 1, name: "PVR Cinemas", location: "Phoenix Mall" },
    { id: 2, name: "INOX", location: "City Center" },
    { id: 3, name: "Cinepolis", location: "Forum Mall" },
    { id: 4, name: "Carnival Cinemas", location: "Central Plaza" },
]

const showTimes = [
    "09:30 AM",
    "12:45 PM",
    "04:00 PM",
    "07:15 PM",
    "10:30 PM",
]

const screenTypes = [
    { type: "2D", priceMultiplier: 1 },
    { type: "3D", priceMultiplier: 1.3 },
    { type: "IMAX", priceMultiplier: 1.8 },
    { type: "4DX", priceMultiplier: 2 },
]

const getRandomStatus = () => {
    const rand = Math.random()
    if (rand < 0.5) return { status: 'available', seatsLeft: Math.floor(Math.random() * 100) + 50 }
    if (rand < 0.75) return { status: 'fast-filling', seatsLeft: Math.floor(Math.random() * 30) + 20 }
    if (rand < 0.9) return { status: 'almost-full', seatsLeft: Math.floor(Math.random() * 15) + 5 }
    return { status: 'sold-out', seatsLeft: 0 }
}

const basePrice = 250

// Generate shows for all movies
export const generateShows = (movieId) => {
    const dates = generateDates()
    const shows = []
    let showId = 1

    dates.forEach(date => {
        theaters.forEach(theater => {
            // Each theater has 2-4 shows per movie per day
            const numShows = Math.floor(Math.random() * 3) + 2
            const selectedTimes = [...showTimes].sort(() => Math.random() - 0.5).slice(0, numShows)
            const screenType = screenTypes[Math.floor(Math.random() * screenTypes.length)]

            selectedTimes.forEach(time => {
                const { status, seatsLeft } = getRandomStatus()
                shows.push({
                    id: showId++,
                    movieId,
                    theaterId: theater.id,
                    theaterName: theater.name,
                    theaterLocation: theater.location,
                    date,
                    time,
                    screenType: screenType.type,
                    price: Math.round(basePrice * screenType.priceMultiplier),
                    totalSeats: 150,
                    availableSeats: seatsLeft,
                    status,
                })
            })
        })
    })

    return shows.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return a.time.localeCompare(b.time)
    })
}

export const getShowsByMovieId = (movieId) => {
    return generateShows(parseInt(movieId))
}

export const getShowsByDate = (movieId, date) => {
    const allShows = generateShows(parseInt(movieId))
    return allShows.filter(show => show.date === date)
}

export const getTheaters = () => theaters

export const getShowById = (movieId, showId) => {
    const shows = getShowsByMovieId(movieId)
    return shows.find(show => show.id === parseInt(showId))
}
