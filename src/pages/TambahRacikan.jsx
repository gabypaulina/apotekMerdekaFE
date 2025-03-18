import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'

import axios from "axios";
import { Container, Form, Row, Col, ListGroup, Modal, Button } from "react-bootstrap"

const TambahRacikan = () => {
  const navigate = useNavigate()
  const [produkRacikan, setProdukRacikan] = useState([]);
  const [kodeRacikan, setKodeRacikan] = useState('');
  const [namaRacikan, setNamaRacikan] = useState('');
  const [hpp, setHpp] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [produkList, setProdukList] = useState([])

  useEffect(() => {
    const fetchProdukList = async () => {
      try{
        const response = await axios.get("http://localhost:3000/api/products");
        setProdukList(response.data)
      }catch(err) {
        console.error("Gagal mengambil daftar produk", err)
      }
    }
    fetchProdukList()
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!produkRacikan || !kodeRacikan || !namaRacikan || !hpp || !hargaJual) {
      setError('Semua Field harus diisi.');
      return;
    }

    setProdukRacikan([])
    setKodeRacikan('')
    setNamaRacikan('')
    setHpp('')
    setHargaJual('')
  };

  const handleSaveRacikan = async() => {
    if (!produkRacikan || !kodeRacikan || !namaRacikan || !hpp || !hargaJual) {
      setError('Semua Field harus diisi.');
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/addRacikan", {
        produkRacikan,
        kodeRacikan,
        namaRacikan,
        hpp,
        hargaJual
      });
      if(response.status == 201) {
        alert("Product saved successfully");
        navigate('/produk')
      }
    }catch(err) {
      console.error("Gagal menyimpan racikan: ", err);
      if(err.response){
        alert(`Error: ${err.response.data.message}`)
      }else{
        alert("Gagal menyimpan racikan")
      }
    }
  }

  const handlePilihProduk = (produk) => {
    setProdukRacikan((prev) => [...prev, produk])
    setShowModal(false)
  }

  const handleHapusProduk = (id) => {
    setProdukRacikan((prev) => prev.filter((produk) => produk._id !== id))
  }

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

  return (
    <>
      <Container className="mt-4 Raleway">
        <div className="titleProduct">
          <p>TAMBAH RACIKAN</p>
        </div>
        <div className="group-add text-center mt-5 mb-5">
          <button className="addProductRacikan" onClick={() => setShowModal(true)}>
            + <br />
            ADD PRODUCT
          </button>
        </div>

        {produkRacikan.length > 0 && (
          <div className="mb-4">
            <h5>Produk Yang Dipilih :</h5>
            <ListGroup>
              {produkRacikan.map((produk) => (
                <ListGroup.Item key ={produk._id}>
                  {produk.namaProduk} - {produk.noBatch} - {formatTanggal(produk.exp)}
                  <Button variant='danger' size="sm" className="ms-2" onClick={() => handleHapusProduk(produk._id)}>Hapus</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={6}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Kode Racikan</Form.Label>
                <Form.Control
                  type="name"
                  placeholder=""
                  value={kodeRacikan}
                  onChange={(e) => setKodeRacikan(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Nama Racikan</Form.Label>
                <Form.Control
                  type="name"
                  placeholder=""
                  value={namaRacikan}
                  onChange={(e) => setNamaRacikan(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formHargaJual" className="mb-3">
            <Form.Label>Harga Pokok Rp</Form.Label>
            <Form.Control
              type="name"
              placeholder="Contoh : Rp 5.000"
              value={hpp}
              onChange={(e) => setHpp(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formHargaJual" className="mb-3">
            <Form.Label>Harga Jual Rp</Form.Label>
            <Form.Control
              type="name"
              placeholder="Contoh : Rp 5.000"
              value={hargaJual}
              onChange={(e) => setHargaJual(e.target.value)}
            />
          </Form.Group>

          {error && <p className="text-danger">{error}</p>}
        
          <button className="save mt-4 mb-4" type="submit" style={{width: '100%'}} onClick={handleSaveRacikan}>SIMPAN</button>
        </Form>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pilih Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {produkList.map((produk) => (
              <ListGroup.Item key={produk._id} action onClick={()=>handlePilihProduk(produk)}>
                {produk.namaProduk} - {produk.noBatch} - {formatTanggal(produk.exp)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Tutup</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TambahRacikan