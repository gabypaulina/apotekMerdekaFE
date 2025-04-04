import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import axios from "axios";
import { Container, Form, Row, Col, ListGroup, Modal, Button } from "react-bootstrap"

const EditRacikan = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [produkRacikan, setProdukRacikan] = useState([]);
  const [kodeRacikan, setKodeRacikan] = useState('');
  const [namaRacikan, setNamaRacikan] = useState('');
  const [hpp, setHpp] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [produkList, setProdukList] = useState([])

  useEffect(() => {
    fetchProdukList()
    fetchRacikanEdit()
  }, [id])

  const fetchProdukList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      setProdukList(response.data)
    } catch (err) {
      console.error("Gagal mengambil daftar produk", err)
    }
  }

  const fetchRacikanEdit = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/racikans/${id}`);
      const racikan = response.data;
      console.log("Data Racikan dari backend: ", racikan);

      const productDetails = await Promise.all(
        racikan.produkRacikan.map(async (id) => {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
          return response.data;
        })
      );

      setProdukRacikan(productDetails);
      setKodeRacikan(racikan.kodeRacikan);
      setNamaRacikan(racikan.namaRacikan);
      setHpp(racikan.hpp);
      setHargaJual(racikan.hargaJual);
    } catch (err) {
      console.error("Failed to fetch racikan: ", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/racikans/${id}`, {
        produkRacikan,
        kodeRacikan,
        namaRacikan,
        hpp,
        hargaJual,
      });

      if (response.status === 200) {
        alert("Racikan updated successfully");
        navigate('/produk');
      }
    } catch (err) {
      console.error("Failed to update racikan: ", err);
      alert(err.response?.data?.message || "Failed to update racikan");
    }
  };

  const handlePilihProduk = (produk) => {
    setProdukRacikan((prev) => [...prev, produk]);
    setShowModal(false);
  }

  const handleHapusProduk = (id) => {
    setProdukRacikan((prev) => prev.filter((produk) => produk._id !== id));
  }

  return (
    <Container className="mt-4 Raleway">
      <div className="titleProduct">
        <p>EDIT RACIKAN</p>
      </div>
      <button className="addProductRacikan mt-5 mb-5" onClick={() => setShowModal(true)}>
        + <br /> ADD PRODUCT
      </button>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={6}>
            <Form.Group controlId="formKodeRacikan" className="mb-3">
              <Form.Label>Kode Racikan</Form.Label>
              <Form.Control type="text" value={kodeRacikan} onChange={(e) => setKodeRacikan(e.target.value)} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formNamaRacikan" className="mb-3">
              <Form.Label>Nama Racikan</Form.Label>
              <Form.Control type="text" value={namaRacikan} onChange={(e) => setNamaRacikan(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formHPP" className="mb-3">
          <Form.Label>Harga Pokok Rp</Form.Label>
          <Form.Control type="text" value={hpp} onChange={(e) => setHpp(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formHargaJual" className="mb-3">
          <Form.Label>Harga Jual Rp</Form.Label>
          <Form.Control type="text" value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} />
        </Form.Group>
        {error && <p className="text-danger">{error}</p>}
        <button className="save mt-4 mb-4" type="submit" style={{ width: '100%' }}>SIMPAN</button>
      </Form>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pilih Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {produkList.map((produk) => (
              <ListGroup.Item key={produk._id} action onClick={() => handlePilihProduk(produk)}>
                {produk.namaProduk} - {produk.kodeProduk}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Tutup</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default EditRacikan;
