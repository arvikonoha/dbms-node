const pool = require('../../util/database-config')

async function* resolveServices(orders) {
  let service_details;
  for (let i of orders) {
    service_details = await pool.query("SELECT s.service_text,v.title,v.vid from service_details s,vendor_details v,register_details r where s.vid = v.vid and r.order_id = $1 and r.service_id = s.service_id", [i])
    yield service_details.rows
  }
}

module.exports = async (req) => {
  let orders = await pool.query("select order_id,title,order_from,order_to from order_details where uid=$1", [req.user])
  console.log(orders.rows)
  if (orders.rowCount < 0)
    return Promise.resolve([]);
  orders = orders.rows
  let counter = 0
  for await (let i of resolveServices(orders.map(item => item.order_id))) {
    orders[counter++].services = i
  }
  console.log(orders)
  return Promise.resolve(orders);
}