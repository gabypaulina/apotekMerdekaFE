import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Form, Row, Col, ListGroup, Modal, Button } from "react-bootstrap";

const EditResepan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [produkResepan, setProdukResep] = useState([]);
  const [kodeResep, setKodeResep] = useState('');
  const [namaResep, setNamaResep] = useState('');
  const [hpp, setHpp] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [produkList, setProdukList] = useState([]);

  useEffect(() => {
    fetchProdukList();
    fetchResepanEdit();
  }, [id]);

  const fetchProdukList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProdukList(response.data);
    } catch (err) {
      console.error("Gagal mengambil daftar produk", err);
    }
  };

  const fetchResepanEdit = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/resepans/${id}`);
      const resep = response.data;
      console.log("Data Resep dari backend: ", resep);
      console.log("Produk Resepan: ", resep.produkResepan);
  
      setProdukResep(resep.produkResepan);
      setKodeResep(resep.kodeResep);
      setNamaResep(resep.namaResep);
      setHpp(resep.hpp);
      setHargaJual(resep.hargaJual);
    } catch (err) {
      console.error("Gagal mengambil data resepan:", err);
    }
  };
  const handlePilihProduk = (produk) => {
    setSelectedProduk(produk);
    setShowQuantityModal(true);
  };

  const handleConfirmQuantity = () => {
    if (selectedProduk && quantity > 0) {
      setProdukResep((prev) => [...prev, { produk: selectedProduk, quantity }]);
      setShowQuantityModal(false);
      setQuantity(1);
    }
  };

  const handleHapusProduk = (index) => {
    setProdukResep((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(`http://localhost:3000/api/resepans/${id}`, {
        produkResepan: produkResepan.map((item) => ({
          produk: item.produk._id, // Kirim ID produk
          quantity: item.quantity // Kirim jumlah pcs
        })),
        kodeResep,
        namaResep,
        hpp,
        hargaJual,
      });
  
      if (response.status === 200) {
        alert("Resep berhasil diperbarui");
        navigate('/produk');
      }
    } catch (err) {
      console.error("Gagal memperbarui resep: ", err);
      if (err.response) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Gagal memperbarui resep");
      }
    }
  };

  return (
    <>
      <Container className="mt-4 Raleway">
        <div className="titleProduct">
          <p>EDIT RESEP</p>
        </div>
        <div className="group-add text-center mt-5 mb-5">
          <button className="addProductRacikan" onClick={() => setShowModal(true)}>
            + <br />
            ADD PRODUCT
          </button>
        </div>

        {produkResepan.length > 0 && (
          <div className="mb-4">
            <h5>Produk Yang Dipilih :</h5>
            <ListGroup>
              {produkResepan.map((item, index) => (
                <ListGroup.Item key={index}>
                  {item.produk.namaProduk} - {item.produk.kodeProduk} (Qty: {item.quantity})
                  <Button variant='danger' size="sm" className="ms-2" onClick={() => handleHapusProduk(index)}>Hapus</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={6}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Kode Resep</Form.Label>
                <Form.Control
                  type="name"
                  placeholder=""
                  value={kodeResep}
                  onChange={(e) => setKodeResep(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Nama Paket</Form.Label>
                <Form.Control
                  type="name"
                  placeholder=""
                  value={namaResep}
                  onChange={(e) => setNamaResep(e.target.value)}
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

          <button className="save mt-4 mb-4" type="submit" style={{ width: '100%' }}>SIMPAN</button>
        </Form>
      </Container>

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

      <Modal show={showQuantityModal} onHide={() => setShowQuantityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Masukkan Jumlah Pcs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formQuantity">
            <Form.Label>Jumlah Pcs</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuantityModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleConfirmQuantity}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditResepan;