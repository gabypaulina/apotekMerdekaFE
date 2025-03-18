import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import axios from "axios";

const Profit = () => {
  const [bulan, setBulan] = useState(""); // State untuk bulan
  const [tahun, setTahun] = useState(""); // State untuk tahun
  const [profitData, setProfitData] = useState(null); // State untuk menyimpan hasil profit

  // Fungsi untuk menghitung profit bersih
  const calculateProfit = async () => {
    if (!bulan || !tahun) {
      alert("Bulan dan tahun harus diisi.");
      return;
    }
  
    try {
      // Kirim request ke backend
      const response = await axios.get("http://localhost:3000/api/profit-bersih", {
        params: {
          bulan, // Kirim bulan sebagai angka (3)
          tahun, // Kirim tahun sebagai string ("2023")
        },
      });
  
      // Simpan hasil perhitungan dari backend
      setProfitData(response.data);
    } catch (error) {
      console.error("Error calculating profit:", error);
      alert("Gagal menghitung profit. Silakan coba lagi.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>PROFIT BERSIH</h2>

      {/* Form untuk memilih bulan dan tahun */}
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>Filter Bulan dan Tahun</Card.Title>
          <Form>
            <Row>
              <Col xs={3}>
                <Form.Group controlId="formBulan">
                  <Form.Label>Bulan</Form.Label>
                  <Form.Control
                    as="select"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                  >
                    <option value="">Pilih Bulan</option>
                    <option value="1">Januari</option>
                    <option value="2">Februari</option>
                    <option value="3">Maret</option>
                    <option value="4">April</option>
                    <option value="5">Mei</option>
                    <option value="6">Juni</option>
                    <option value="7">Juli</option>
                    <option value="8">Agustus</option>
                    <option value="9">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group controlId="formTahun">
                  <Form.Label>Tahun</Form.Label>
                  <Form.Control
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    placeholder="Tahun"
                  />
                </Form.Group>
              </Col>
              <Col xs={3} className="d-flex align-items-end">
                <Button variant="primary" onClick={calculateProfit}>
                  Hitung Profit
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Tampilkan hasil profit bersih */}
      {profitData && (
  <Card className="mt-3">
    <Card.Body>
      <h4>Hasil Profit Bersih</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Keterangan</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Laba Kotor</td>
            <td>Rp {profitData.labaKotor.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Total Utang</td>
            <td>Rp {profitData.totalUtang.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Total Biaya Operasional</td>
            <td>Rp {profitData.totalBiayaOperasional.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Profit Bersih</td>
            <td
              style={{
                color: profitData.profitBersih >= 0 ? "green" : "red",
              }}
            >
              Rp {profitData.profitBersih.toLocaleString("id-ID")}
            </td>
          </tr>
        </tbody>
      </Table>
    </Card.Body>
  </Card>
)}
    </Container>
  );
};

export default Profit;