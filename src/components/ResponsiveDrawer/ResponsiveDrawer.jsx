import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { WarehousePages } from "../../Pages/WarehousePages/WarehousePages";
import { StoresPages } from "../../Pages/StoresPage/StoresPages";
import { SalePages } from "../../Pages/SalePage/SalePages";
import StatisticPage from "../../Pages/StatisticPage/StatisticPage";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
  };

  const drawer = (
    <div>
      <Toolbar>
        <h1>Eldik</h1>
      </Toolbar>
      <Divider />
      <List>
        {["Склад", "Магазины", "Продажи", "Статистика"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => handleMenuItemClick(index)}
              selected={selectedIndex === index}
            >
              <ListItemIcon>
                {index === 0 && <WarehouseIcon />}
                {index === 1 && <LocalGroceryStoreIcon />}
                {index === 2 && <PointOfSaleRoundedIcon />}
                {index === 3 && <BarChartIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", sm: `calc(100% - 240px)` },
        }}
      >
        <Toolbar />
        {selectedIndex === 0 && <WarehousePages />}
        {selectedIndex === 1 && <StoresPages />}
        {selectedIndex === 2 && <SalePages />}
        {selectedIndex === 3 && <StatisticPage />}
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
