import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";

const LabaRugi = () => {
  const [startDate, setStartDate] = useState(""); // State untuk tanggal mulai
  const [endDate, setEndDate] = useState(""); // State untuk tanggal akhir
  const [labaRugiData, setLabaRugiData] = useState(null); // State untuk menyimpan hasil laba rugi

  // Fungsi untuk menghitung laba rugi
  const calculateLabaRugi = async () => {
    try {
      // Validasi input tanggal
      if (!startDate || !endDate) {
        alert("Tanggal mulai dan tanggal akhir harus diisi.");
        return;
      }

      // Kirim request ke backend
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/laba-rugi`, {
        params: {
          startDate: new Date(startDate).toISOString(), // Konversi ke format ISO
          endDate: new Date(endDate).toISOString(),     // Konversi ke format ISO
        },
      });

      setLabaRugiData(response.data); // Simpan hasil perhitungan
    } catch (error) {
      console.error("Error calculating laba rugi:", error);
      alert("Gagal menghitung laba rugi. Silakan coba lagi.");
    }
  };

  return (
    <>
      <Container className="mt-4 Raleway">
        <div className="titleProduct">
          <h2>LAPORAN LABA RUGI</h2>
        </div>

        {/* Form untuk memilih range tanggal */}
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Filter Tanggal</Card.Title>
            <Form>
              <Row>
                <Col xs={4}>
                  <Form.Group controlId="formStartDate">
                    <Form.Label>Tanggal Mulai</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={4}>
                  <Form.Group controlId="formEndDate">
                    <Form.Label>Tanggal Akhir</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={4} className="d-flex align-items-end">
                  <Button variant="primary" onClick={calculateLabaRugi}>
                    Hitung Laba Rugi
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Tampilkan hasil laba rugi */}
        {labaRugiData && (
          <Card className="mt-3">
            <Card.Body>
              <h4 className="text-center">
                <strong>LAPORAN LABA RUGI</strong>
              </h4>
              <h5 className="text-center">
                Periode : {new Date(startDate).toLocaleDateString("id-ID")} - {new Date(endDate).toLocaleDateString("id-ID")}
              </h5>
              <div className="ms-5 me-5 mt-5">
                <div className="d-flex">
                  <h5>Total Penjualan :</h5>
                  <h5 className="ms-auto">Rp {labaRugiData.totalPenjualan?.toLocaleString("id-ID") || "0"}</h5>
                </div>
                <div className="ms-4 mt-4">
                  <p className="mb-4">diterima dalam bentuk:</p>
                  <ul className="ms-3">
                    <li>
                      <div className="d-flex">
                        <p className="mb-4">Cash : </p>
                        <p className="mb-0" style={{marginLeft: '30%'}}> Rp {labaRugiData.totalPenjualanCash?.toLocaleString("id-ID") || "0"}</p>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex">
                        <p className="mb-0">QRIS : </p>
                        <p className="mb-0" style={{marginLeft: '30%'}}>Rp {labaRugiData.totalPenjualanQRIS?.toLocaleString("id-ID") || "0"}</p>
                      </div>
                    </li>
                  </ul>
                </div>

              <div className="mt-4 d-flex">
                <h6>Harga Pokok Penjualan (HPP) : </h6>
                <p className="ms-auto">Rp {labaRugiData.totalHPP?.toLocaleString("id-ID") || "0"}</p>
              </div>

              <hr />

              <div className="mt-4 d-flex">
                <h5>LABA PENJUALAN :</h5>
                <h5
                  style={{
                    color: labaRugiData.labaRugi >= 0 ? "green" : "red",
                  }}
                  className="ms-auto"
                >
                  Rp {labaRugiData.labaRugi?.toLocaleString("id-ID") || "0"}
                </h5>
              </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default LabaRugi;