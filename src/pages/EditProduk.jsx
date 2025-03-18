import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, FloatingLabel } from "react-bootstrap";
import axios from "axios";

const EditProduk = () => {
  const { id } = useParams();
  const [kodeProduk, setKodeProduk] = useState('');
  const [noBatch, setNoBatch] = useState('');
  const [namaProduk, setNamaProduk] = useState('');
  const [exp, setExp] = useState('');
  const [hpp, setHpp] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [stok, setStok] = useState('');
  const [notifStok, setNotifStok] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [margin, setMargin] = useState(0); // State untuk margin
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductEdit();
  }, [id]);

  const fetchProductEdit = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${id}`);
      const product = response.data;
      setKodeProduk(product.kodeProduk);
      setNoBatch(product.noBatch);
      setNamaProduk(product.namaProduk);
      setExp(product.exp);
      setHpp(product.hpp);
      setHargaJual(product.hargaJual);
      setStok(product.stok);
      setNotifStok(product.notifStok);
      setDeskripsi(product.deskripsi);
      calculateMargin(product.hpp, product.hargaJual); // Hitung margin awal
    } catch (err) {
      console.error("Failed to fetch product: ", err);
    }
  };

  // Fungsi untuk menghitung margin
  const calculateMargin = (hpp, hargaJual) => {
    if (hpp && hargaJual) {
      const marginValue = ((hargaJual - hpp) / hargaJual) * 100;
      setMargin(marginValue.toFixed(2)); // Mengambil 2 angka di belakang koma
    } else {
      setMargin(0);
    }
  };

  // Hitung margin setiap kali hpp atau hargaJual berubah
  useEffect(() => {
    calculateMargin(hpp, hargaJual);
  }, [hpp, hargaJual]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/api/products/${id}`, {
        kodeProduk,
        noBatch,
        namaProduk,
        exp,
        hpp,
        hargaJual,
        stok,
        notifStok,
        deskripsi
      });

      if (response.status === 200) {
        alert("Product updated successfully");
        navigate('/produk');
      }
    } catch (err) {
      console.error("Failed to update product: ", err);
      if (err.response) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Failed to update product");
      }
    }
  };

  return (
    <>
      <Container className="mt-4 Raleway">
        <div className="titleProduct">
          <p>EDIT PRODUK</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={6}>
              <Form.Group controlId="formKode" className="mb-3">
                <Form.Label>Kode Produk</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={kodeProduk}
                  onChange={(e) => setKodeProduk(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formNoBatch" className="mb-3">
                <Form.Label>No. Batch</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={noBatch}
                  onChange={(e) => setNoBatch(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Nama Produk</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="formDate">
                <Form.Label>EXP Produk</Form.Label>
                <Form.Control
                  type="date"
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formHpp" className="mb-3">
            <Form.Label>Harga Pokok Rp</Form.Label>
            <Form.Control
              type="number"
              placeholder="Contoh : Rp 5000"
              value={hpp}
              onChange={(e) => setHpp(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formHargaJual" className="mb-3">
            <Form.Label>Harga Jual Rp</Form.Label>
            <Form.Control
              type="number"
              placeholder="Contoh : Rp 5000"
              value={hargaJual}
              onChange={(e) => setHargaJual(e.target.value)}
            />
          </Form.Group>

          {/* Form Margin */}
          <Form.Group controlId="formMargin" className="mb-3">
            <Form.Label>Margin Keuntungan (%)</Form.Label>
            <Form.Control
              type="text"
              value={`${margin}%`}
              readOnly
            />
          </Form.Group>

          <Row>
            <Col xs={6}>
              <Form.Group controlId="formStok" className="mb-3">
                <Form.Label>Jumlah Stok</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={stok}
                  onChange={(e) => setStok(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formNotif" className="mb-3">
                <Form.Label>Notifikasi Limit Stok</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={notifStok}
                  onChange={(e) => setNotifStok(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Label>Deskripsi Produk</Form.Label>
          <FloatingLabel controlId="floatingTextarea2">
            <Form.Control
              as="textarea"
              placeholder="Obat ini adalah ..."
              style={{ height: '200px' }}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </FloatingLabel>

          <button className="save mt-4 mb-4" type="submit" style={{ width: '100%' }}>UPDATE</button>
        </Form>
      </Container>
    </>
  );
};

export default EditProduk;