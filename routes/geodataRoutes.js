// === routes/geodataRoutes.js ===
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ✅ API pour polygones visibles dans la carte (bbox)
// GET /api/geodata/polygones
router.get("/polygones", async (req, res) => {
  const { minLat, minLng, maxLat, maxLng } = req.query;

  if (!minLat || !minLng || !maxLat || !maxLng) {
    return res.status(400).json({ error: "Paramètres bbox manquants" });
  }

  const query = `
   SELECT titref, ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry
FROM benguerir4326
limit 100
  `;

  try {
    const { rows } = await pool.query(query)
    const geojson = {
      type: "FeatureCollection",
      features: rows.map((row) => ({
        type: "Feature",
        geometry: row.geometry,
        properties: { titref: row.titref },
      })),
    };

    res.json(geojson);
  } catch (error) {
    console.error("Erreur récupération polygones bbox:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});





// ✅ API recherche par titre foncier
router.get("/search", async (req, res) => {
  const { numero_titre } = req.query;

  if (!numero_titre) {
    return res.status(400).json({ error: "Paramètre numero_titre manquant" });
  }

  const query = `
    SELECT titref, ST_AsGeoJSON(geom)::json AS geometry
    FROM benguerir4326
    WHERE titref ILIKE $1
  `;

  try {
    const { rows } = await pool.query(query, [`%${numero_titre}%`]);

    const geojson = {
      type: "FeatureCollection",
      features: rows.map((row) => ({
        type: "Feature",
        geometry: row.geometry,
        properties: { titref: row.titref },
      })),
    };

    res.json(geojson);
  } catch (error) {
    console.error("Erreur recherche titre:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


module.exports = router;
