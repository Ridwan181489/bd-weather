export default async function handler(req, res) {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "city required" });
  }

  const apiKey = process.env.API_KEY;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(400).json({ error: data.message });
    }

    res.status(200).json({
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like
    });

  } catch (err) {
    res.status(500).json({ error: "fetch failed" });
  }
}
