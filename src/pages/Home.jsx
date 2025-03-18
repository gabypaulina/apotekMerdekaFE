import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Alert } from "react-bootstrap"; // Import Alert dari React Bootstrap
import axios from "axios"; // Import axios untuk fetching data

// ASSET
import daftarProduk from '../assets/daftarProduk.png';
import jurnal from '../assets/jurnal.png';
import histori from '../assets/histori2.png';
import pembayaran from '../assets/pembayaran.png';
import penjualan from '../assets/penjualan2.png';
import logo from '../assets/logo.png';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // State untuk menyimpan data produk
  const [stockAlert, setStockAlert] = useState(''); // Notifikasi stok menipis
  const [expAlert, setExpAlert] = useState(''); // Notifikasi exp mendekati

  // Fungsi untuk navigasi
  const moveToProduk = () => navigate('/produk');
  const moveToHistori = () => navigate('/pembelian');
  const moveToPembayaran = () => navigate('/pembayaran');
  const moveToPenjualan = () => navigate('/penjualan');

  // Ambil data produk dari backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
        checkNotifications(response.data); // Cek notifikasi setelah data diambil
      } catch (err) {
        console.error("Gagal mengambil data produk: ", err);
      }
    };
    fetchProducts();
  }, []);

  // Fungsi untuk mengecek notifikasi stok dan exp
  const checkNotifications = (products) => {
    let stockMessage = '';
    let expMessage = '';

    products.forEach((product) => {
      // Cek stok menipis
      if (product.stok <= product.notifStok) {
        stockMessage += `Stok ${product.namaProduk} menipis! Stok saat ini: ${product.stok}. Segera lakukan restok.\n`;
      }

      // Cek exp mendekati
      const today = new Date();
      const expDate = new Date(product.exp);
      const timeDiff = expDate - today; // Selisih dalam milidetik
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Konversi ke hari

      if (daysDiff <= 90) { // Jika kurang dari atau sama dengan 3 bulan (90 hari)
        expMessage += `Produk ${product.namaProduk} mendekati kedaluwarsa! Sisa waktu: ${daysDiff} hari.\n`;
      }
    });

    // Set notifikasi
    setStockAlert(stockMessage);
    setExpAlert(expMessage);
  };

  return (
    <div className="content">
      <div className="logo">
        <div className="d-flex align-items-center">
          <img src={logo} alt="" />
          <div className="title">
            <div className="apotek">
              <h1>APOTEK</h1>
            </div>
            <div className="merdeka">
              <h1>MERDEKA</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Notifikasi Stok Menipis */}
      {stockAlert && (
        <Alert variant="warning" className="m-3">
          <strong>Peringatan Stok Menipis:</strong>
          <pre>{stockAlert}</pre>
        </Alert>
      )}

      {/* Notifikasi Exp Mendekati */}
      {expAlert && (
        <Alert variant="danger" className="m-3">
          <strong>Peringatan Kedaluwarsa:</strong>
          <pre>{expAlert}</pre>
        </Alert>
      )}

      <div className="buttons Rimouski">
        <div className="flex-row">
          {/* <button>
            <div className="flex flex-column">
              <img src={jurnal} alt="" />
              <p className='m-0' onClick={moveToJurnal}>JURNAL</p>
            </div>
          </button> */}
          <button style={{marginRight: '50px' }}>
            <div className="flex flex-column">
              <img src={daftarProduk} alt="" />
              <p className='m-0' onClick={moveToProduk}>PRODUK</p>
            </div>
          </button>
          <button>
            <div className="flex flex-column">
              <img src={histori} alt="" />
              <p className='m-0' onClick={moveToHistori}>PEMBELIAN</p>
            </div>
          </button>
        </div>
        <div className="flex-row">
          <button style={{ marginRight: '25px' }}>
            <div className="flex flex-column">
              <img src={pembayaran} alt="" />
              <p className='m-0' onClick={moveToPembayaran}>PEMBAYARAN</p>
            </div>
          </button>
          <button style={{ marginLeft: '25px' }}>
            <div className="flex flex-column">
              <img src={penjualan} alt="" />
              <p className='m-0' onClick={moveToPenjualan}>PENJUALAN</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;