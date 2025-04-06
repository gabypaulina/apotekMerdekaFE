import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import axios from "axios";

const Utang = () => {
  const [utangList, setUtangList] = useState([]);

  // Ambil data utang dari backend saat komponen di-mount
  useEffect(() => {
    fetchUtang();
  }, []);

  const fetchUtang = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/utang`);
      setUtangList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data utang:", error);
    }
  };

  const handlePelunasan = async (kodePembelian) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/pembelian/lunasi/${kodePembelian}`);
      console.log("Utang dilunasi:", response.data);

      // Update state secara lokal tanpa perlu fetch ulang
      setUtangList((prevUtangList) =>
        prevUtangList.map((utang) =>
          utang.kodePembelian === kodePembelian
            ? { ...utang, statusPembayaran: "lunas", tanggalBayar: new Date().toISOString() }
            : utang
        )
      );
    } catch (error) {
      console.error("Gagal melunasi utang:", error);
    }
  };

  // Fungsi untuk memformat angka menjadi format mata uang
  const formatCurrency = (value) => {
    return value.toLocaleString("id-ID");
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID");
  };

  return (
    <Container className="mt-4 Raleway">
      <div className="titleProduct mb-4">
        <h2>UTANG APOTEK</h2>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Kode Pembelian</th>
            <th>Tanggal Beli</th>
            <th>Supplier</th>
            <th>Total Pembelian</th>
            <th>Uang Muka</th>
            <th>Sisa Utang</th>
            <th>Tanggal Jatuh Tempo</th>
            <th>Status</th>
            <th>Tanggal Bayar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {utangList.map((utang) => (
            <tr key={utang.kodePembelian}>
              <td>{utang.kodePembelian}</td>
              <td>{formatDate(utang.tanggalBeli)}</td>
              <td>{utang.kodeSupplier}</td>
              <td>Rp {formatCurrency(utang.totalPembelian)}</td>
              <td>Rp {formatCurrency(utang.uangMuka)}</td>
              <td>Rp {formatCurrency(utang.hutang)}</td>
              <td>{formatDate(utang.tanggalPelunasan)}</td>
              <td>{utang.statusPembayaran === "belum lunas" ? "Belum Lunas" : "Lunas"}</td>
              <td>{formatDate(utang.tanggalBayar)}</td>
              <td>
                {utang.statusPembayaran === "belum lunas" ? (
                  <Button variant="success" onClick={() => handlePelunasan(utang.kodePembelian)}>
                    Lunasi
                  </Button>
                ) : (
                  <span>✅</span> // Tampilkan tanda centang jika sudah lunas
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Utang;