// Bring in required Modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path")
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();

app.use(cookieParser());
app.use(express.static(__dirname + '/app'));


// var corsOptions = {
//   origin: "http://localhost:8081",
// };


app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


const db = require("./app/central/models/user");
db.sequelize.sync();

//app.use(routes);
//app.use("", routes);

//Central db routes
require('./app/central/routes/auth.routes')(app);
require('./app/central/routes/users.routes')(app);
require('./app/central/routes/raw_mat.routes')(app);
require('./app/central/routes/uom.routes')(app);
require('./app/central/routes/role_permission.routes')(app);
require('./app/central/routes/roles.routes')(app);
require('./app/central/routes/mainmenu.routes')(app);
require('./app/central/routes/submenu.routes')(app);
require('./app/central/routes/wh_pr_mas.routes')(app);
require('./app/central/routes/wh_pr_det.routes')(app);
require('./app/central/routes/wh_po_mas.routes')(app);
require('./app/central/routes/wh_po_det.routes')(app);
require('./app/central/routes/wh_grn_mas.routes')(app);
require('./app/central/routes/wh_grn_det.routes')(app);
require('./app/central/routes/wh_so_mas.routes')(app);
require('./app/central/routes/wh_so_det.routes')(app);
require('./app/central/routes/department_setup.routes')(app);
require('./app/central/routes/dept_type.routes')(app);
require('./app/central/routes/wh_mat_rate.routes')(app);
require('./app/central/routes/retailer.routes')(app);
require('./app/central/routes/client.routes')(app);
require('./app/central/routes/apk.routes')(app);
require('./app/central/routes/wh_vendor.routes')(app);
require('./app/central/routes/comp_detail.routes')(app);


//individual routes
require('./app/individual/routes/prod_cost.routes')(app);
require('./app/individual/routes/product.routes')(app);
require('./app/individual/routes/sub_product.routes')(app);
require('./app/individual/routes/customer.routes')(app);
require('./app/individual/routes/ord_type.routes')(app);
require('./app/individual/routes/pay_type.routes')(app);
require('./app/individual/routes/ot_detail.routes')(app);
require('./app/individual/routes/pt_detail.routes')(app);
require('./app/individual/routes/ord_mas_routes')(app);
require('./app/individual/routes/ord_det.routes')(app);
require('./app/individual/routes/deal_provider.routes')(app);
require('./app/individual/routes/deal_setup.routes')(app);
require('./app/individual/routes/deal_item.routes')(app);
require('./app/individual/routes/discount.routes')(app);
require('./app/individual/routes/br_pr_mas.routes')(app);
require('./app/individual/routes/br_pr_det.routes')(app);
require('./app/individual/routes/br_grn_mas.routes')(app);
require('./app/individual/routes/br_grn_det.routes')(app);
require('./app/individual/routes/mat_rate_setup.routes')(app);
require('./app/individual/routes/till_setup.routes')(app);
require('./app/individual/routes/daily_days.routes')(app);
require('./app/individual/routes/tax_type.routes')(app);
require('./app/individual/routes/sale_return_setup.routes')(app);
require('./app/individual/routes/exchange_setup.routes')(app);
require('./app/individual/routes/mart_ord_mas.routes')(app);
require('./app/individual/routes/mart_ord_det.routes')(app);
require('./app/individual/routes/subpro_rate_setup.routes')(app);
require('./app/individual/routes/branch_product.routes')(app);
require('./app/individual/routes/banner.routes')(app);
require('./app/individual/routes/online_ord_mas.routes')(app);
require('./app/individual/routes/online_ord_det.routes')(app);
require('./app/individual/routes/br_po_mas.routes')(app);
require('./app/individual/routes/br_po_det.routes')(app);
require('./app/individual/routes/br_mat_sale.routes')(app);
require('./app/individual/routes/add_to_cart.routes')(app);
require('./app/individual/routes/customer_address.routes')(app);
require('./app/individual/routes/deal_beverages.routes')(app);
require('./app/individual/routes/printer.routes')(app);
require('./app/individual/routes/day_shifts.routes')(app);
require('./app/individual/routes/expense_type.routes')(app);
require('./app/individual/routes/expense_setup.routes')(app);
require('./app/individual/routes/expense_out.routes')(app);
require('./app/individual/routes/tax_calculation.routes')(app);
require('./app/individual/routes/pnl.routes')(app);
require('./app/individual/routes/areas.routes')(app);
require('./app/individual/routes/raw_mat_cat.routes')(app);
require('./app/individual/routes/vendor_setup.routes')(app);
require('./app/individual/routes/custom_sku.routes')(app);
require('./app/individual/routes/raw_mat_det.routes')(app);
require('./app/individual/routes/ret_expiry_setup.routes')(app);

app.use("/public", express.static(path.join(__dirname, 'public')));

// Define PORT
const PORT = process.env.PORT || 8080;

// Listen to the defined PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
