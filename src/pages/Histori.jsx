import { useState, useEffect } from "react";
import { Container, Table, Form, Row, Col, Button, Modal } from "react-bootstrap";
import axios from "axios";

const Histori = () => {
  const [kodePembelian, setKodePembelian] = useState("");
  const [tanggalBeli, setTanggalBeli] = useState("");
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [noFakturAsli, setNoFakturAsli] = useState("");
  const [metodePembelian, setMetodePembelian] = useState("cash");
  const [tanggalPelunasan, setTanggalPelunasan] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [namaSupplier, setNamaSupplier] = useState("");
  const [noHpSupplier, setNoHpSupplier] = useState("");
  const [produk, setProduk] = useState(Array(11).fill({}));
  const [uangMuka, setUangMuka] = useState(0);
  const [totalPembelian, setTotalPembelian] = useState(0);
  const [tanggalKirim, setTanggalKirim] = useState("");
  const [hutang, setHutang] = useState(0);
  const [noBatch, setNoBatch] = useState("");
  const [searchKodeSupplier, setSearchKodeSupplier] = useState("");
  const [searchTanggalKirim, setSearchTanggalKirim] = useState("");
  const [filteredFakturs, setFilteredFakturs] = useState([]);
  const [fakturs, setFakturs] = useState([]);
  const [tempSearchKodeSupplier, setTempSearchKodeSupplier] = useState("");
  const [tempSearchTanggalKirim, setTempSearchTanggalKirim] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Ambil kode pembelian terakhir dari localStorage saat komponen di-mount
  useEffect(() => {
    const lastKode = localStorage.getItem("lastKodePembelian");
    const lastDate = localStorage.getItem("lastKodeDate");
    const today = new Date().toISOString().split("T")[0];

    if (lastDate === today && lastKode) {
      setKodePembelian(lastKode);
    } else {
      setKodePembelian("INV-001");
    }
  }, []);

  // Fungsi untuk mengambil data faktur dari backend
  const fetchFakturs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/fakturs");
      setFakturs(response.data);
      setFilteredFakturs(response.data);
    } catch (err) {
      console.log("Error fetching fakturs: ", err);
    }
  };

  // Ambil data faktur saat komponen di-mount
  useEffect(() => {
    fetchFakturs();
  }, []);

  // Fungsi untuk memicu pencarian
  const handleCari = () => {
    const filtered = fakturs.filter((faktur) => {
      const matchKodeSupplier = tempSearchKodeSupplier ? faktur.kodeSupplier === tempSearchKodeSupplier : true;
      const matchTanggalKirim = tempSearchTanggalKirim ? formatDate(faktur.tanggalKirim) === tempSearchTanggalKirim : true;
      return matchKodeSupplier && matchTanggalKirim;
    });

    if (filtered.length > 0) {
      setFilteredFakturs(filtered);
      setShowSearchResults(true);
    } else {
      alert("Data tidak ditemukan!");
      setShowSearchResults(false);
    }
  };

  const bersihkanTanggal = (dateString) => {
    // Contoh: "22T00:00:00.000Z-03-2025" -> "2025-03-22"
    const [day, monthYear] = dateString.split("T")[0].split("-");
    const [month, year] = monthYear.split("-");
    return `${year}-${month}-${day}`;
  };

  // Fungsi untuk mengubah format tanggal dari "dd/MM/yyyy" ke "yyyy-MM-dd"
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
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

  const handleReset = () => {
    // Reset state pencarian
    setTempSearchKodeSupplier("");
    setTempSearchTanggalKirim("");
    setSearchKodeSupplier("");
    setSearchTanggalKirim("");

    // Reset state form input
    setKodePembelian("INV-001");
    setTanggalBeli("");
    setKodeSupplier("");
    setNoFakturAsli("");
    setMetodePembelian("cash");
    setTanggalPelunasan("");
    setProduk(Array(11).fill({}));
    setUangMuka(0);
    setTotalPembelian(0);
    setHutang(0);
    setTanggalKirim("");
    setNoBatch("");

    // Reset state hasil pencarian
    setShowSearchResults(false);
    setFilteredFakturs(fakturs);
  };

  // Fungsi untuk generate kode pembelian baru
  const generateKodePembelian = () => {
    const today = new Date().toISOString().split("T")[0]; // Ambil tanggal hari ini
    const lastKode = localStorage.getItem("lastKodePembelian");
    const lastDate = localStorage.getItem("lastKodeDate");
  
    if (lastDate === today && lastKode) {
      // Jika tanggal sama, increment kode
      const lastNumber = parseInt(lastKode.split("-")[1]) || 0; // Ambil angka dari kode terakhir
      const newNumber = lastNumber + 1; // Tambah 1 dari kode terakhir
      const newKode = `INV-${String(newNumber).padStart(3, "0")}`; // Format: INV-XXX
      return newKode;
    } else {
      // Jika tanggal berbeda atau belum ada kode, mulai dari 1
      const newKode = "INV-001"; // Format: INV-001
      return newKode;
    }
  };

  // Handle tombol Simpan
  const handleSimpan = async () => {
    try {
      // Generate kode pembelian baru untuk placeholder
      const newKodePlaceholder = generateKodePembelian();
  
      // Kurangi 1 dari angka kode pembelian untuk disimpan
      const angkaKode = parseInt(newKodePlaceholder.split("-")[1]) || 0; // Ambil angka dari kode
      const newKodeSimpan = `INV-${String(angkaKode - 1).padStart(3, "0")}`; // Kurangi 1 dan format ulang
  
      // Validasi data
      if (
        !tanggalBeli ||
        !kodeSupplier ||
        !noFakturAsli ||
        !metodePembelian ||
        produk.length === 0 ||
        !totalPembelian ||
        !tanggalKirim
      ) {
        alert("Semua field wajib harus diisi!");
        return;
      }
  
      // Validasi metode pembelian
      if (metodePembelian === "kredit" && !tanggalPelunasan) {
        alert("Tanggal pelunasan wajib diisi untuk metode kredit!");
        return;
      }
  
      // Data yang akan dikirim ke backend
      const data = {
        kodePembelian: newKodeSimpan, // Gunakan newKodeSimpan (kode yang dikurangi 1)
        tanggalBeli,
        kodeSupplier,
        noFakturAsli,
        metodePembelian,
        tanggalPelunasan: metodePembelian === "kredit" ? tanggalPelunasan : null,
        produk: produk.filter((item) => item.kode && item.nama && item.harga && item.noBatch && item.qty),
        totalPembelian,
        uangMuka: metodePembelian === "cash" ? totalPembelian : uangMuka || 0,
        hutang: metodePembelian === "cash" ? 0 : hutang || totalPembelian - (uangMuka || 0),
        tanggalKirim,
      };
  
      console.log("Data yang dikirim ke backend:", data); // Debugging
  
      // Kirim data ke backend
      const response = await axios.post("http://localhost:3000/api/fakturs", data);
  
      console.log("Faktur berhasil disimpan:", response.data);
  
      // Simpan kode pembelian terakhir ke localStorage
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("lastKodePembelian", newKodePlaceholder); // Simpan kode placeholder
      localStorage.setItem("lastKodeDate", today);
  
      // Update kode pembelian di state
      setKodePembelian(newKodePlaceholder); // Tampilkan kode placeholder di input
  
      // Reset form setelah simpan
      setTanggalBeli("");
      setKodeSupplier("");
      setNoFakturAsli("");
      setMetodePembelian("cash");
      setTanggalPelunasan("");
      setProduk(Array(11).fill({}));
      setUangMuka(0);
      setTotalPembelian(0);
      setHutang(0);
      setTanggalKirim("");
  
      alert("Faktur berhasil disimpan!");
    } catch (error) {
      console.error("Error menyimpan faktur:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert("Gagal menyimpan faktur: " + error.response.data.message); // Tampilkan pesan error dari backend
      } else {
        alert("Gagal menyimpan faktur: " + error.message);
      }
    }
  };
  
  // Handle perubahan metode pembelian
  useEffect(() => {
    if (metodePembelian === "cash") {
      setTanggalPelunasan("");
    }
  }, [metodePembelian]);

  // Handle perubahan produk
  const handleProdukChange = (index, field, value) => {
    const newProduk = [...produk];
    newProduk[index] = { ...newProduk[index], [field]: value };
  
    // Hitung jumlah (harga * qty) untuk produk ini
    if (field === "harga" || field === "qty") {
      const harga = newProduk[index].harga || 0;
      const qty = newProduk[index].qty || 0;
      newProduk[index].jumlah = harga * qty;
    }
  
    setProduk(newProduk);
  };

  // Hitung total pembelian dan hutang
  useEffect(() => {
    const total = produk.reduce((sum, item) => sum + (item.harga || 0) * (item.qty || 0), 0);
    setTotalPembelian(total);
    setHutang(total - uangMuka);
  }, [produk, uangMuka]);

  // Ambil data supplier dari backend saat komponen di-mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fungsi untuk mengambil data supplier dari backend
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/suppliers");
      setSuppliers(response.data);
    } catch (err) {
      console.log("Error fetching suppliers: ", err);
    }
  };

  // Tambah supplier
  const handleAddSupplier = async () => {
    try {
      // Kirim data supplier ke backend
      const response = await axios.post("http://localhost:3000/api/suppliers", {
        nama: namaSupplier,
        noHp: noHpSupplier,
      });

      console.log("Supplier berhasil ditambahkan:", response.data);

      // Refresh daftar supplier dari backend
      fetchSuppliers();

      // Tutup modal dan reset form
      setShowModal(false);
      setNamaSupplier("");
      setNoHpSupplier("");
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert("Gagal menambahkan supplier: " + error.message); // Tampilkan pesan error
    }
  };

  const formatCurrency = (value) => {
    // Pastikan value adalah angka
    const number = parseFloat(value);
    if (isNaN(number)) return ""; // Jika bukan angka, kembalikan string kosong
  
    // Format angka dengan pemisah ribuan (titik)
    return number.toLocaleString("id-ID");
  };

  const parseCurrency = (value) => {
    // Hapus semua titik dan ubah koma menjadi titik (jika ada)
    return value.replace(/\./g, "").replace(",", ".");
  };

  return (
    <Container className="mt-4 Raleway">
      <div className="titleProduct">
        <h2 className="mb-0">PEMBELIAN</h2>
      </div>

      {/* Form Pencarian */}
      <Row className="mt-4 justify-content-center">
        <Col md={3}>
          <Form.Group>
            <Form.Select
              value={tempSearchKodeSupplier}
              onChange={(e) => setTempSearchKodeSupplier(e.target.value)}
            >
              <option value="">Pilih Kode Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.kode} value={supplier.kode}>
                  {supplier.kode} - {supplier.nama}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Control
              type="date"
              value={tempSearchTanggalKirim}
              onChange={(e) => setTempSearchTanggalKirim(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button variant="primary" onClick={handleCari}>
              Cari
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Col>
        </Row>
  
        <hr className="mt-4" />
  
        {/* Tampilkan Hasil Pencarian */}
        {showSearchResults && (
          <>
          {filteredFakturs.map((faktur, index) => (
            <div key={index} className="mb-4">
              <h4>{faktur.kodePembelian} - {faktur.hutang > 0 ? "BELUM LUNAS" : "LUNAS"}</h4>
              <p>Nomor Faktur : {faktur.noFakturAsli}</p>
              <p>Tanggal Beli : {formatTanggal(faktur.tanggalBeli)}</p>
              <p>Tanggal Kirim : {formatTanggal(faktur.tanggalKirim)}</p>
              <p>Total Pembayaran : Rp {formatCurrency(faktur.totalPembelian)}</p>
              {faktur.hutang > 0 && (
                <>
                  <p>Uang Muka : Rp {formatCurrency(faktur.uangMuka)}</p>
                  <p style={{color:'red'}}>Utang : Rp {formatCurrency(faktur.hutang)}</p>
                </>
              )}
              <h5>Data Produk:</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode</th>
                    <th>Nama Produk</th>
                    <th>Harga (satuan)</th>
                    <th>No. Batch</th>
                    <th>Qty (per box)</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {faktur.produk.map((produk, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{produk.kode}</td>
                      <td>{produk.nama}</td>
                      <td>Rp {formatCurrency(produk.harga)}</td>
                      <td>{produk.noBatch}</td>
                      <td>{produk.qty}</td>
                      <td>Rp {formatCurrency(produk.harga * produk.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </>
      )}

      {/* Form Input dan Tabel (ditampilkan jika tidak ada hasil pencarian) */}
      {!showSearchResults && (
        <>
          {/* Form Input */}
          <Row className="mt-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Kode Pembelian</Form.Label>
                <Form.Control
                  type="text"
                  value={kodePembelian || "INV-001"}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tgl Beli</Form.Label>
                <Form.Control
                  type="date"
                  value={tanggalBeli}
                  onChange={(e) => setTanggalBeli(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tgl Kirim</Form.Label>
                <Form.Control
                  type="date"
                  value={tanggalKirim}
                  onChange={(e) => setTanggalKirim(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
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
                <Button variant="link" onClick={() => setShowModal(true)}>
                  Tambah Supplier
                </Button>
              </Form.Group>
            </Col>
          </Row>

      <Row className="mt-2">
        <Col md={3}>
          <Form.Group>
            <Form.Label>No. Faktur Asli</Form.Label>
            <Form.Control
              type="text"
              value={noFakturAsli}
              onChange={(e) => setNoFakturAsli(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Metode Pembelian</Form.Label>
            <Form.Select
              value={metodePembelian}
              onChange={(e) => setMetodePembelian(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="kredit">Kredit</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {metodePembelian === "kredit" && (
          <Col md={3}>
            <Form.Group>
              <Form.Label>Tgl Pelunasan</Form.Label>
              <Form.Control
                type="date"
                value={tanggalPelunasan}
                onChange={(e) => setTanggalPelunasan(e.target.value)}
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      {/* Tabel Produk */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama Produk</th>
            <th>Harga (satuan)</th>
            <th>No. Batch</th>
            <th>Qty (per box)</th>
            <th>Disc 1</th>
            <th>Disc 2</th>
            <th>Disc 3</th>
            <th>PPN</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {produk.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Form.Control
                  type="text"
                  value={item.kode || ""}
                  onChange={(e) => handleProdukChange(index, "kode", e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={item.nama || ""}
                  onChange={(e) => handleProdukChange(index, "nama", e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.harga || ""}
                  onChange={(e) => handleProdukChange(index, "harga", parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={item.noBatch || ""}
                  onChange={(e) => handleProdukChange(index, "noBatch", e.target.value)}
                />
              </td>              
              <td>
                <Form.Control
                  type="number"
                  value={item.qty || ""}
                  onChange={(e) => handleProdukChange(index, "qty", parseInt(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.disc1 || ""}
                  onChange={(e) => handleProdukChange(index, "disc1", parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.disc2 || ""}
                  onChange={(e) => handleProdukChange(index, "disc2", parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.disc3 || ""}
                  onChange={(e) => handleProdukChange(index, "disc3", parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.ppn || ""}
                  onChange={(e) => handleProdukChange(index, "ppn", parseFloat(e.target.value))}
                />
              </td>
              <td>{(item.harga || 0) * (item.qty || 0)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Total Pembelian */}
      <Row className="mt-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Total Pembelian</Form.Label>
            <Form.Control type="text" value={formatCurrency(totalPembelian)} disabled />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
          <Form.Control
  type="text"
  value={formatCurrency(uangMuka)}
  onChange={(e) => {
    const parsedValue = parseCurrency(e.target.value);
    setUangMuka(parsedValue);
  }}
/>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Hutang</Form.Label>
            <Form.Control type="text" value={formatCurrency(hutang)} disabled />
          </Form.Group>
        </Col>
      </Row>

      {/* Tombol Aksi */}
      <Row className="mt-4">
        <Col>
          <Button variant="primary" onClick={handleSimpan}>
            Simpan
          </Button>
          <Button variant="secondary" className="ms-2">
            Batal
          </Button>
        </Col>
      </Row>

      {/* Modal Tambah Supplier */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama Supplier</Form.Label>
              <Form.Control
                type="text"
                value={namaSupplier}
                onChange={(e) => setNamaSupplier(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>No. HP Supplier</Form.Label>
              <Form.Control
                type="text"
                value={noHpSupplier}
                onChange={(e) => setNoHpSupplier(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleAddSupplier}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
      </>
      )}
    </Container>
  );
};

export default Histori;