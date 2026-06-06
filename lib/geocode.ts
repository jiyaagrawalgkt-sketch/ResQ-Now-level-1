export async function getCoordinates(
  city: string,
  state: string
) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        city
      )}&state=${encodeURIComponent(
        state
      )}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "Emergency-Resource-Platform",
        },
      }
    );

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}