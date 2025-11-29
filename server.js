require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const API_KEY = process.env.API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get('/', (req, res) => res.send('Troq backend working'));

app.post('/api/oneway/create', async (req, res) => {
  const headerKey = req.headers['x-api-key'];
  if (!headerKey || headerKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const b = req.body;

    const newData = {
      service_category: b.service_category,
      trip_mode: b.trip_mode,
      trip_type: b.trip_type,
      ow_trip_date: b.date,
      ow_trip_time: b.time,
      ow_hours: b.hours,
      ow_pickup_text: b.pickup_text,
      ow_pickup_lat: b.pickup_lat,
      ow_pickup_lng: b.pickup_lng,
      ow_drop_text: b.drop_text,
      ow_drop_lat: b.drop_lat,
      ow_drop_lng: b.drop_lng,
      ow_username: b.username,
      ow_status: "price_pending",
      request_id: uuidv4()
    };

    const { data, error } = await supabase
      .from('oneway_bookings')
      .insert([newData])
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.json({
      success: true,
      booking_id: data.booking_id,
      request_id: data.request_id,
      status: data.ow_status
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
