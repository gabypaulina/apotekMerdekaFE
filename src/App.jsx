import { Fragment, useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Route, Routes, NavLink, useNavigate } from "react-router-dom";
import './App.css';

// PAGES
import Home from './pages/Home';
import Histori from './pages/Histori';
import Pembayaran from './pages/Pembayaran';
import Produk from './pages/Produk';
import Login from './components/Login';
import Penjualan from './pages/Penjualan';
import TambahProduk from './pages/TambahProduk';
import TambahRacikan from './pages/TambahRacikan';
import TambahPaketan from './pages/TambahPaketan';
import EditProduk from "./pages/EditProduk";
import EditRacikan from "./pages/EditRacikan";
import EditResepan from "./pages/EditResepan";
import TambahFaktur from "./pages/TambahFaktur";
import BiayaOperasional from './pages/BiayaOperasional';
import Utang from './pages/Utang';
import LabaRugi from './pages/LabaRugi';
import Retur from "./pages/Retur";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";

// NAVBAR
import home from '../src/assets/home.png';
import histori from '../src/assets/histori.png';
import penjualan from '../src/assets/penjualan.png';
import produk from '../src/assets/produk.png';
import menu from '../src/assets/menu.png';
import Profit from "./pages/Profit";

function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate()

  const handleDropdownToggle = (isOpen) => {
    setShowDropdown(isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("fullName")

    navigate("/login")
  }

  return (
    <Fragment>
      <div className="app">
        <Nav className="navbar">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <img src={home} alt="" />
          </NavLink>
          <NavLink to="/pembelian" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <img src={histori} alt="" />
          </NavLink>
          <NavLink to="/pembayaran" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <img src={penjualan} alt="" />
          </NavLink>
          <NavLink to="/penjualan" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <img src={produk} alt="" />
          </NavLink>

          {/* Tombol tiga garis dengan dropdown */}
          <NavDropdown
            title={<img src={menu} alt="Menu" />}
            id="nav-dropdown"
            align="end"
            show={showDropdown}
            onToggle={handleDropdownToggle}
          >
            <NavDropdown.Item as={NavLink} to="/biaya-operasional">
              Biaya Operasional
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/utang">
              Utang
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/laba-rugi">
              Laporan Laba Rugi
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/profit">
              Profit Apotek
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/retur">
              Retur Barang
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>

        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "karyawan-alfi", "owner"]}>
              <Home />
            </ProtectedRoute>
          } />

          {/* Route untuk karyawan-alfi */}
          <Route path="/pembayaran" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "karyawan-alfi", "owner"]}>
              <Pembayaran />
          </ProtectedRoute>
          } />
          <Route path="/produk" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "karyawan-alfi", "owner"]}>
              <Produk />
          </ProtectedRoute>
          } />
          <Route path="/produk/add" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "karyawan-alfi", "owner"]}>
              <TambahProduk />
          </ProtectedRoute>
          } />

          {/* Route untuk karyawan-yessi */}
          <Route path="/pembelian" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "owner"]}>
              <Histori />
            </ProtectedRoute>
          } />
          <Route path="/penjualan" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "owner", "karyawan-alfi"]}>
              <Penjualan />
            </ProtectedRoute>
          } />
          <Route path="/produk/:id" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "owner"]}>
              <EditProduk />
          </ProtectedRoute>
          } />
          <Route path="/produk/addRacikan" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "owner"]}>
              <TambahRacikan />
          </ProtectedRoute>
          } />
          <Route path="/produk/addPaketan" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "owner"]}>
              <TambahPaketan />
          </ProtectedRoute>
          } />
          <Route path="/racikan/:id" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "owner"]}>
              <EditRacikan />
          </ProtectedRoute>
          } />
          <Route path="/resepan/:id" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "owner"]}>
              <EditResepan />
          </ProtectedRoute>
          } />
          <Route path="/tambah-faktur" element={
            <ProtectedRoute allowedRoles={["karyawan-yessi", "owner"]}>
              <TambahFaktur />
            </ProtectedRoute>
          } />

          {/* Routes untuk owner */}
          <Route path="/biaya-operasional" element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <BiayaOperasional />
            </ProtectedRoute>
          } />
          <Route path="/utang" element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <Utang />
            </ProtectedRoute>
          } />
          <Route path="/laba-rugi" element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <LabaRugi />
            </ProtectedRoute>
          } />
          <Route path="/profit" element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <Profit />
            </ProtectedRoute>
          } />
          <Route path="/retur" element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <Retur />
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>
    </Fragment>
  );
}

export default App;