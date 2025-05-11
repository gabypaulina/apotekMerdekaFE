import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";
import * as XLSX from 'xlsx';

// ASSET
import search from '../assets/search.png';

const Produk = () => {
  const [productsApotek, setProductApotek] = useState([]);
  const [racikanApotek, setRacikanApotek] = useState([]);
  const [resepanApotek, setResepanApotek] = useState([]);
  const [searchKode, setSearchKode] = useState(''); // State untuk pencarian kode
  const [searchNama, setSearchNama] = useState(''); // State untuk pencarian nama
  const [searchBatch, setSearchBatch] = useState(''); // State untuk pencarian no. batch
  const [searchDeskripsi, setSearchDeskripsi] = useState(''); // State untuk pencarian deskripsi
  const [totalProduk, setTotalProduk] = useState(0);
  const [totalFilteredProduk, setTotalFilteredProduk] = useState(0);
  const [sortMethod, setSortMethod] = useState('newest')
  

  const navigate = useNavigate();

  const exportToExcel = () => {
    // Filter hanya produk biasa (bukan racikan/resep)
    const productsToExport = productsApotek.map(product => ({
      'Kode Produk': product.kodeProduk,
      'No. Batch': product.noBatch,
      'Nama Produk': product.namaProduk,
      'EXP Date': formatTanggal(product.exp),
      'HPP': product.hpp,
      'Harga Jual': product.hargaJual,
      'Stok': product.stok,
      'Notif Stok': product.notifStok,
      'Deskripsi': product.deskripsi || ''
    }));

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(productsToExport);
    
    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daftar Produk");
    
    // Export ke file Excel
    XLSX.writeFile(wb, "daftar_produk.xlsx");
  };

  const moveToAdd = () => navigate('/produk/add');
  const moveToAddRacikan = () => navigate('/produk/addRacikan');
  const moveToAddPaketan = () => navigate('/produk/addPaketan');

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      setProductApotek(response.data);
      setTotalProduk(response.data.length)
    } catch (err) {
      console.log('Error fetching products: ', err);
    }
  };

  const fetchRacikans = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/racikans`);
      setRacikanApotek(response.data);
    } catch (err) {
      console.log('Error fetching racikans: ', err);
    }
  };

  const fetchResepans = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resepans`);
      setResepanApotek(response.data);
    } catch (err) {
      console.log('Error fetching resepans: ', err);
    }
  };

  const handleProductClick = (id) => navigate(`/produk/${id}`);
  const handleRacikanClick = (id) => navigate(`/racikan/${id}`);
  const handleResepanClick = (id) => navigate(`/resepan/${id}`);

  useEffect(() => {
    fetchProducts();
    fetchRacikans();
    fetchResepans();
  }, []);

  // Fungsi untuk memfilter produk, racikan, dan resepan berdasarkan pencarian
  const filteredProducts = productsApotek.filter((product) => {
    const matchKode = product.kodeProduk.toLowerCase().includes(searchKode.toLowerCase());
    const matchNama = product.namaProduk.toLowerCase().includes(searchNama.toLowerCase());
    const matchBatch = product.noBatch.toLowerCase().includes(searchBatch.toLowerCase());
    const matchDeskripsi = product.deskripsi?.toLowerCase().includes(searchDeskripsi.toLowerCase());
    const result = matchKode && matchNama && matchBatch && matchDeskripsi;
    return result
  });

  useEffect(() => {
    setTotalFilteredProduk(filteredProducts.length)
  }, [filteredProducts])

  const filteredRacikans = racikanApotek.filter((racikan) => {
    const matchKode = racikan.kodeRacikan.toLowerCase().includes(searchKode.toLowerCase());
    const matchNama = racikan.namaRacikan.toLowerCase().includes(searchNama.toLowerCase());
    return matchKode && matchNama;
  });

  const filteredResepans = resepanApotek.filter((resepan) => {
    const matchKode = resepan.kodeResep.toLowerCase().includes(searchKode.toLowerCase());
    const matchNama = resepan.namaResep.toLowerCase().includes(searchNama.toLowerCase());
    return matchKode && matchNama;
  });

  const filteredAndSortedProducts = filteredProducts.sort((a,b) => {
    if (sortMethod === 'a-z') {
      return a.namaProduk.localeCompare(b.namaProduk)
    }else {
      return b._id.localeCompare(a._id)
    }
  })

  const settings = {
    slidesToShow: 4,
    infinite: filteredProducts.length >= 9,
    row: 1000
  };

  const settingss = {
    slidesToShow: 4,
    infinite: filteredRacikans.length >= 9,
    row: 1000
  };

  const settingsss = {
    slidesToShow: 4,
    infinite: filteredResepans.length >= 9,
    row: 1000
  };

  const formatTanggal = (dateString) => {
    // Jika dateString adalah format ISO (2025-03-15T00:00:00.000+00:00), ambil bagian tanggalnya saja
    const date = new Date(dateString);
    
    // Ambil tanggal, bulan, dan tahun
    const day = String(date.getDate()).padStart(2, '0'); // Pastikan 2 digit
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const year = date.getFullYear();
  
    // Format menjadi dd/MM/yyyy
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value) => {
    // Pastikan value adalah angka
    const number = parseFloat(value);
    if (isNaN(number)) return ""; // Jika bukan angka, kembalikan string kosong
  
    // Format angka dengan pemisah ribuan (titik)
    return number.toLocaleString("id-ID");
  };
  

  return (
    <>
      <Container className="mt-4 Raleway">
        <div className="titleProduct d-flex align-items-center">
          <p className="mb-0">PRODUK</p>
          <div className="d-flex ms-auto">
            <button className="addProduct" onClick={moveToAdd}><strong>TAMBAH PRODUK</strong></button>
            <button className="addProduct ms-3 me-3" onClick={moveToAddRacikan}><strong>TAMBAH RACIKAN</strong></button>
            <button className="addProduct" onClick={moveToAddPaketan}><strong>TAMBAH PAKET RESEPAN</strong></button>
            <Button 
              variant="success" 
              className="ms-3"
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
          </div>
        </div>

        {/* Search Engine */}
        <div className="searchEnginee row mt-4">
          <div className="col-3">
            <Form className="d-flex align-items-center">
              <Form.Control
                type="search"
                placeholder="Kode Produk/Racikan/Resepan"
                className="me-2"
                aria-label="Search"
                value={searchKode}
                onChange={(e) => setSearchKode(e.target.value)}
              />
              <img src={search} alt="" />
            </Form>
          </div>
          <div className="col-3">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Nama Produk/Racikan/Resepan"
                className="me-2"
                aria-label="Search"
                value={searchNama}
                onChange={(e) => setSearchNama(e.target.value)}
              />
              <img src={search} alt="" />
            </Form>
          </div>
          <div className="col-3">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="No. Batch (Produk)"
                className="me-2"
                aria-label="Search"
                value={searchBatch}
                onChange={(e) => setSearchBatch(e.target.value)}
              />
              <img src={search} alt="" />
            </Form>
          </div>
          <div className="col-3">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Deskripsi Produk"
                className="me-2"
                aria-label="Search"
                value={searchDeskripsi}
                onChange={(e) => setSearchDeskripsi(e.target.value)}
              />
              <img src={search} alt="" />
            </Form>
          </div>
        </div>

        {/* PRODUK PABRIK */}
        <p className='mt-5 text-center' style={{ fontSize: '30px' }}>PRODUK</p>

        <div className="d-flex justify-content-between mt-3 mb-3">
          <strong>Total Produk : {totalProduk}</strong>
          <strong>Tampil : {totalFilteredProduk}</strong>
          <div className="sort-filter">
            <Form.Select 
              size="sm" 
              style={{ width: '180px' }}
              value={sortMethod}
              onChange={(e) => setSortMethod(e.target.value)}
            >
              <option value="newest">Terbaru</option>
              <option value="a-z">A-Z</option>
            </Form.Select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p>No products</p>
        ) : (
          <Slider {...settings}>
            {filteredAndSortedProducts.map((product) => (
              <div key={product._id}>
                <Card style={{ width: '20rem', marginTop: '40px' }}>
                  <Card.Body>
                    <Row>
                      <Col xs={4}>
                        <Card.Text>
                          <strong>KODE :</strong> <br /> {product.kodeProduk}
                        </Card.Text>
                      </Col>
                      <Col>
                        <Card.Text>
                          <strong>NO. BATCH :</strong> <br />{product.noBatch}
                        </Card.Text>
                      </Col>
                    </Row>
                    <hr />
                    <Card.Text className='mt-3'>
                      <strong>NAMA :</strong> <br /> {product.namaProduk}
                    </Card.Text>
                    <Card.Text>
                      <strong>EXP DATE:</strong> <br /> {formatTanggal(product.exp)}
                    </Card.Text>
                    <hr />
                    <Row className="mt-3 mb-3">
                      <Col xs={6}>
                        <Card.Text>
                          <strong>HARGA :</strong> {formatCurrency(product.hargaJual)}
                        </Card.Text>
                      </Col>
                      <Col xs={6}>
                        <Card.Text>
                          <strong>STOK :</strong> {product.stok}
                        </Card.Text>
                      </Col>
                    </Row>
                    <button className="edit" style={{ marginTop: '10px', width: '100%' }} onClick={() => handleProductClick(product._id)}>
                      <strong>EDIT PRODUK</strong>
                    </button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
        )}

        {/* RACIKAN */}
        <p className='mt-5 text-center' style={{ fontSize: '30px' }}>RACIKAN</p>
        {filteredRacikans.length === 0 ? (
          <p>No Racikan</p>
        ) : (
          <Slider {...settingss}>
            {filteredRacikans.map((racikan) => (
              <div key={racikan._id}>
                <Card style={{ width: '20rem', marginTop: '40px' }}>
                  <Card.Body>
                    <Card.Text>
                      <strong>KODE :</strong> {racikan.kodeRacikan}
                    </Card.Text>
                    <hr />
                    <Card.Text className='mt-3'>
                      <strong>NAMA :</strong> {racikan.namaRacikan}
                    </Card.Text>
                    <hr />
                    <Row className="mt-3 mb-3">
                      <Col xs={6}>
                        <Card.Text>
                          <strong>HARGA :</strong> {formatCurrency(racikan.hargaJual)}
                        </Card.Text>
                      </Col>
                    </Row>
                    <button className="edit" style={{ marginTop: '10px', width: '100%' }} onClick={() => handleRacikanClick(racikan._id)}>
                      <strong>EDIT PRODUK</strong>
                    </button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
        )}

        {/* RESEPAN */}
        <p className='mt-5 text-center' style={{ fontSize: '30px' }}>RESEPAN</p>
        {filteredResepans.length === 0 ? (
          <p>No Resep</p>
        ) : (
          <Slider {...settingsss}>
            {filteredResepans.map((resepan) => (
              <div key={resepan._id}>
                <Card style={{ width: '20rem', marginTop: '40px' }}>
                  <Card.Body>
                    <Card.Text>
                      <strong>KODE :</strong> {resepan.kodeResep}
                    </Card.Text>
                    <hr />
                    <Card.Text className='mt-3'>
                      <strong>NAMA :</strong> {resepan.namaResep}
                    </Card.Text>
                    <hr />
                    <Row className="mt-3 mb-3">
                      <Col xs={6}>
                        <Card.Text>
                          <strong>HARGA :</strong> {formatCurrency(resepan.hargaJual)}
                        </Card.Text>
                      </Col>
                    </Row>
                    <button className="edit" style={{ marginTop: '10px', width: '100%' }} onClick={() => handleResepanClick(resepan._id)}>
                      <strong>EDIT PRODUK</strong>
                    </button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
        )}
      </Container>
    </>
  );
};

export default Produk;