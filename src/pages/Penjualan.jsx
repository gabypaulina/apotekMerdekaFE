import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Table, Form, Row, Col, Button } from "react-bootstrap";

const Penjualan = () => {
  const [transactions, setTransactions] = useState([]);
  const [topSales, setTopSales] = useState([]); // State untuk TOP SALE
  const [shift, setShift] = useState(""); // State untuk shift
  const [startDate, setStartDate] = useState(""); // State untuk tanggal mulai
  const [endDate, setEndDate] = useState(""); // State untuk tanggal akhir

  // Fungsi untuk mengambil data transaksi dari backend
  const fetchTransactions = async () => {
    try {
      const params = {};
      if (shift) params.shift = shift; // Tambahkan shift ke params jika ada
      if (startDate && endDate) {
        params.startDate = new Date(startDate).toISOString(); // Konversi ke format ISO
        params.endDate = new Date(endDate).toISOString();     // Konversi ke format ISO
      }

      const response = await axios.get("http://localhost:3000/api/transactions", {
        params, // Kirim query parameter ke backend
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fungsi untuk mengambil data TOP SALE
  const fetchTopSales = async () => {
    try {
      const params = {};
      if (startDate && endDate) {
        params.startDate = new Date(startDate).toISOString(); // Konversi ke format ISO
        params.endDate = new Date(endDate).toISOString();     // Konversi ke format ISO
      }

      const response = await axios.get("http://localhost:3000/api/top-sale", {
        params, // Kirim query parameter ke backend
      });
      setTopSales(response.data);
    } catch (error) {
      console.error("Error fetching top sales:", error);
    }
  };

  // Ambil data transaksi dan TOP SALE saat komponen di-mount atau filter berubah
  useEffect(() => {
    fetchTransactions();
    fetchTopSales();
  }, [shift, startDate, endDate]); // Jalankan ulang saat shift, startDate, atau endDate berubah

  // Hitung Grand Total dari total pembayaran
  const grandTotal = transactions.reduce((total, transaction) => {
    return total + (transaction.totalPembayaran || 0);
  }, 0);

  return (
    <>
      <Container className="mt-4 Raleway">
        <div className="titleProduct">
          <p className="mb-0">PENJUALAN</p>
        </div>

        {/* Filter Shift dan Tanggal */}
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Filter Transaksi</Card.Title>
            <Row>
              <Col xs={3}>
                <Form.Group controlId="formShift">
                  <Form.Label>Shift</Form.Label>
                  <Form.Control
                    as="select"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                  >
                    <option value="">Semua Shift</option>
                    <option value="Yessi">Yessi</option>
                    <option value="Alfi">Alfi</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group controlId="formStartDate">
                  <Form.Label>Tanggal Mulai</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group controlId="formEndDate">
                  <Form.Label>Tanggal Akhir</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={3} className="d-flex align-items-end">
                <Button variant="primary" onClick={() => { fetchTransactions(); fetchTopSales(); }}>
                  Terapkan Filter
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tampilkan TOP SALE */}
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>TOP SALE</Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Produk</th>
                  <th>Jumlah Terjual</th>
                </tr>
              </thead>
              <tbody>
                {topSales.map((sale, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{sale.namaProduk}</td>
                    <td>{sale.qty}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Tampilkan histori transaksi */}
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Histori Transaksi</Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Transaksi</th>
                  <th>Tanggal Transaksi</th>
                  <th>Total Pembayaran</th>
                  <th>Metode Pembayaran</th>
                  <th>Margin</th>
                  <th>Qty</th>
                  <th>Harga (@)</th>
                  <th>Detail Produk</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <React.Fragment key={transaction._id}>
                    {transaction.produkDibeli.map((produk, idx) => (
                      <tr key={`${transaction._id}-${idx}`}>
                        {idx === 0 && ( // Hanya tampilkan data transaksi sekali di baris pertama
                          <>
                            <td rowSpan={transaction.produkDibeli.length}>{index + 1}</td>
                            <td rowSpan={transaction.produkDibeli.length}>{transaction.kodeTransaksi}</td>
                            <td rowSpan={transaction.produkDibeli.length}>
                              {new Date(transaction.tanggalTransaksi).toLocaleDateString("id-ID")}
                            </td>
                            <td rowSpan={transaction.produkDibeli.length}>
                              Rp {transaction.totalPembayaran?.toLocaleString("id-ID") || "0"}
                            </td>
                            <td rowSpan={transaction.produkDibeli.length}>{transaction.metodePembayaran}</td>
                            <td rowSpan={transaction.produkDibeli.length}>
                              {transaction.margin?.toFixed(2) || "0.00"}%
                            </td>
                          </>
                        )}
                        <td>{produk.qty}</td> {/* Qty */}
                        <td>Rp {produk.hargaJual?.toLocaleString("id-ID") || "0"}</td> {/* Total Harga */}
                        <td>{produk.namaProduk}</td> {/* Detail Produk */}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        
        <h5 className="mt-4">Grand Total: Rp {grandTotal.toLocaleString("id-ID")}</h5>
          
      </Container>
    </>
  );
};

export default Penjualan;