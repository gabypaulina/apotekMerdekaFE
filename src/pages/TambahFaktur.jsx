import React, { useState, useEffect } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TambahFaktur = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]); // State untuk menyimpan daftar supplier
  const [nomorFaktur, setNomorFaktur] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [tanggalKirim, setTanggalKirim] = useState("");
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [metodePembelian, setMetodePembelian] = useState("cash");
  const [tanggalPelunasan, setTanggalPelunasan] = useState("");
  const [showModal, setShowModal] = useState(false); // State untuk menampilkan modal
  const [namaSupplier, setNamaSupplier] = useState(""); // State untuk nama supplier
  const [noHpSupplier, setNoHpSupplier] = useState(""); // State untuk nomor HP supplier

  // Ambil data supplier dari backend saat komponen di-mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fungsi untuk mengambil data supplier dari backend
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers`);
      setSuppliers(response.data); // Simpan data supplier ke state
    } catch (err) {
      console.log('Error fetching suppliers: ', err);
    }
  };

  // Fungsi untuk menambahkan faktur
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/fakturs`, {
        kodePembelian: `KD-${Math.floor(Math.random() * 1000)}`, // Generate kode pembelian otomatis
        nomorFaktur,
        tanggalBeli,
        tanggalKirim,
        kodeSupplier,
        metodePembelian,
        tanggalPelunasan: metodePembelian === "kredit" ? tanggalPelunasan : null,
        tanggalBayar: null
      });

      console.log('Faktur berhasil ditambahkan:', response.data);

      // Reset form dan navigasi ke halaman histori
      setNomorFaktur("");
      setTanggalBeli("");
      setTanggalKirim("");
      setKodeSupplier("");
      setMetodePembelian("cash");
      setTanggalPelunasan("");
      navigate("/histori");
    } catch (error) {
      console.error('Error adding faktur:', error);
    }
  };

  // Fungsi untuk menambahkan supplier
  // const handleAddSupplier = async () => {
  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers`, {
  //       nama: namaSupplier,
  //       noHp: noHpSupplier,
  //     });

  //     console.log('Supplier berhasil ditambahkan:', response.data);

  //     // Tutup modal dan reset form
  //     setShowModal(false);
  //     setNamaSupplier("");
  //     setNoHpSupplier("");
  //   } catch (error) {
  //     console.error('Error adding supplier:', error);
  //   }
  // };

  const handleAddSupplier = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers`, {
        nama: namaSupplier, // Pastikan field ini sesuai
        noHp: noHpSupplier, // Pastikan field ini sesuai
      });
      console.log('Supplier berhasil ditambahkan:', response.data);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <>
      <Container className="mt-4 Raleway">
        <h2>TAMBAH FAKTUR</h2>
        <Form className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label>Nomor Faktur</Form.Label>
            <Form.Control
              type="text"
              value={nomorFaktur}
              onChange={(e) => setNomorFaktur(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tanggal Beli</Form.Label>
            <Form.Control
              type="date"
              value={tanggalBeli}
              onChange={(e) => setTanggalBeli(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tanggal Kirim</Form.Label>
            <Form.Control
              type="date"
              value={tanggalKirim}
              onChange={(e) => setTanggalKirim(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kode Supplier</Form.Label>
            <Form.Select
              value={kodeSupplier}
              onChange={(e) => setKodeSupplier(e.target.value)}
            >
              <option value="">Pilih Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.kode} value={supplier.kode}>
                  {supplier.kode} - {supplier.nama}
                </option>
              ))}
            </Form.Select>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Tambah Supplier
            </Button>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Metode Pembelian</Form.Label>
            <Form.Select
              value={metodePembelian}
              onChange={(e) => setMetodePembelian(e.target.value)}
            >
              <option value="">Pilih Metode Pembelian</option>
              <option value="cash">Cash</option>
              <option value="kredit">Kredit</option>
            </Form.Select>
          </Form.Group>
          {metodePembelian === "kredit" && (
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Pelunasan</Form.Label>
              <Form.Control
                type="date"
                value={tanggalPelunasan}
                onChange={(e) => setTanggalPelunasan(e.target.value)}
              />
            </Form.Group>
          )}
          <button className="save mt-4" onClick={handleSubmit} style={{ width: "100%" }}>
            Submit
          </button>
        </Form>
      </Container>

      {/* Modal untuk menambahkan supplier */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Supplier</Form.Label>
              <Form.Control
                type="text"
                value={namaSupplier}
                onChange={(e) => setNamaSupplier(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>No. HP Supplier</Form.Label>
              <Form.Control
                type="text"
                value={noHpSupplier}
                onChange={(e) => setNoHpSupplier(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddSupplier}>
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TambahFaktur;