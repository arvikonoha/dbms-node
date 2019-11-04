const pool = require("../../util/database-config");

async function* resolveServices(vid, orders) {
  let service_details;
  for (let i of orders) {
    service_details = await pool.query(
      "select service_text from service_details s,register_details r where s.vid=$1 and r.service_id=s.service_id and r.order_id = $2;",
      [vid, i]
    );
    yield service_details.rows
  }
}

module.exports = async req => {
  let orders = await pool.query(
    " select distinct o.title,o.order_from,o.order_to,u.phone,u.address,u.phone,u.email,u.f_name,u.l_name,o.order_id from order_details o,user_details u,register_details r,service_details s where u.uid = o.uid and o.order_id = r.order_id and r.service_id = s.service_id and s.vid=$1",
    [req.user]
  );
  console.log(orders.rows);
  if (orders.rowCount < 0) return Promise.resolve([]);
  orders = orders.rows;
  let counter = 0;
  for await (let i of resolveServices(
    req.user,
    orders.map(item => item.order_id)
  )) {
    orders[counter++].services = i;
  }
  console.log(orders);
  return Promise.resolve(orders);
};