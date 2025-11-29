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

  // API KEY CHECK
  const headerKey = req.headers['x-api-key'];
  if (!headerKey || headerKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const b = req.body;

const newData = {
  user_servicecategory: b.user_servicecategory,
  user_tripmode: b.user_tripmode,
  user_triptype: b.user_triptype,

  ow_tripdate: b.ow_tripdate,
  ow_triptime: b.ow_triptime,
  ow_hours: b.ow_hours,

  ow_pickuptext: b.ow_pickuptext,
  ow_pickuplat: b.ow_pickuplat,
  ow_pickuplng: b.ow_pickuplng,

  ow_droptext: b.ow_droptext,
  ow_droplat: b.ow_droplat,
  ow_droplng: b.ow_droplng,

  ow_username: b.ow_username,
  ow_phone: b.ow_phone,

  request_id: b.request_id,
  ow_status: "price_pending"
};
    // INSERT
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


