import { useState, useEffect } from "react";
import { Container, Button, Form, Table, Modal } from "react-bootstrap";
import axios from "axios";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(angka)
    .replace("Rp", "");
};

const BiayaOperasional = () => {
  const [biayaList, setBiayaList] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [selectedBulan, setSelectedBulan] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear().toString());
  const [showModal, setShowModal] = useState(false);
  const [newKategori, setNewKategori] = useState("");
  const [newJumlah, setNewJumlah] = useState("");

  // Fetch data from backend when the component loads
  useEffect(() => {
    setInputValues({})
    fetchBiaya();
  }, [selectedBulan, setSelectedTahun]);

  const fetchBiaya = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/biaya", {
        params: {
          bulan: selectedBulan,
          tahun: selectedTahun,
        },
      });
      console.log("Data dari backend: ", response.data);
      setBiayaList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data biaya:", error);
    }
  };

  const handleInputChange = (kategori, value) => {
    setInputValues({ ...inputValues, [kategori]: value });
  };

  const handleSave = async (kategori) => {
    const jumlah = inputValues[kategori];
    if (!jumlah || isNaN(jumlah)) {
      alert("Jumlah biaya harus berupa angka.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/biaya", {
        kategori,
        jumlah: parseFloat(jumlah),
        bulan: selectedBulan,
        tahun: selectedTahun, // Kirim tahun yang dipilih
      });
  
      const savedBiaya = response.data;
      const biayaId = savedBiaya._id;
  
      console.log("Saved Biaya ID:", biayaId);
  
      await axios.put(`http://localhost:3000/api/biaya/lock/${biayaId}`);
      fetchBiaya();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menyimpan biaya.";
      console.error("Gagal menyimpan biaya:", errorMessage);
      alert(`Gagal menyimpan biaya: ${errorMessage}`);
    }
  };

  const handleSimpanBiayaTambahan = async () => {
    if (!newKategori || !newJumlah || isNaN(newJumlah)) {
      alert("Kategori dan jumlah biaya harus diisi.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/biaya", {
        kategori: newKategori,
        jumlah: parseFloat(newJumlah),
        bulan: selectedBulan,
        tahun: selectedTahun,
        isCustom: true,
      });
  
      // Lock biaya tambahan yang baru disimpan
      const savedBiaya = response.data;
      const biayaId = savedBiaya._id;
      await axios.put(`http://localhost:3000/api/biaya/lock/${biayaId}`);
  
      // Update state biayaList dengan biaya tambahan yang baru
      setBiayaList((prevBiayaList) => [...prevBiayaList, { ...savedBiaya, isLocked: true }]);
  
      // Reset modal dan input
      setShowModal(false);
      setNewKategori("");
      setNewJumlah("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menyimpan biaya.";
      console.error("Gagal menyimpan biaya tambahan:", errorMessage);
      alert(`Gagal menyimpan biaya tambahan: ${errorMessage}`);
    }
  };
  const handleTambahBiaya = () => {
    setShowModal(true);
  };

  const biayaTetap = [
    "Gaji Pegawai",
    "Biaya Listrik",
    "Sewa Tempat",
    "Biaya Air",
    "Pajak",
    "Pemeliharaan",
  ];

  const biayaTambahan = biayaList.filter(
    (biaya) => biaya.isCustom && biaya.bulan === selectedBulan && biaya.tahun === selectedTahun
  );

  const biayaTetapFiltered = biayaTetap.map((kategori) => {
    const biaya = biayaList.find((b) => b.kategori === kategori && b.bulan === selectedBulan && b.tahun === selectedTahun);
    return biaya ? biaya : { kategori, jumlah: 0, isLocked: false }; // Default jika data tidak ditemukan
  });

  // Fungsi untuk menghitung total biaya operasional
  const hitungTotalBiaya = () => {
    const total = biayaList
      .filter((biaya) => biaya.bulan === selectedBulan && biaya.tahun === selectedTahun) // Filter biaya untuk bulan dan tahun yang dipilih
      .reduce((sum, biaya) => sum + biaya.jumlah, 0); // Jumlahkan semua biaya
  
    return total;
  };

  return (
    <Container className="mt-4 Raleway">
      <div className="d-flex">
        <div className="titleProduct mb-4">
          <h2 className="mb-0">BIAYA OPERASIONAL</h2>
        </div>
        <button onClick={handleTambahBiaya} className="mb-4 save ms-auto">
          <strong>TAMBAH BIAYA</strong>
        </button>
      </div>

      {/* Dropdown untuk memilih bulan */}
      <Form.Select
        value={selectedBulan}
        onChange={(e) => setSelectedBulan(e.target.value)}
        className="mb-3"
      >
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </Form.Select>

      <Form.Control
        type="number"
        placeholder="Masukkan tahun"
        value={selectedTahun}
        onChange={(e) => setSelectedTahun(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Kategori Biaya</th>
            <th>Jumlah Biaya</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* Biaya Tetap */}
          {biayaTetapFiltered.map((biaya, index) => {
            const isLocked = biaya.isLocked;

            return (
              <tr key={index}>
                <td>{biaya.kategori}</td>
                <td>
                  {isLocked ? (
                    <span>{formatRupiah(biaya.jumlah)}</span>
                  ) : (
                    <Form.Control
                      type="number"
                      value={inputValues[biaya.kategori] || ""}
                      onChange={(e) => handleInputChange(biaya.kategori, e.target.value)}
                      disabled={isLocked}
                    />
                  )}
                </td>
                <td>
                  {isLocked ? (
                    <span style={{ color: "green" }}>✔️</span>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => handleSave(biaya.kategori)}
                      disabled={!inputValues[biaya.kategori]}
                    >
                      Simpan
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}

          {/* Biaya Tambahan */}
          {biayaTambahan.map((biaya, index) => (
            <tr key={`custom-${index}`}>
              <td>{biaya.kategori}</td>
              <td>
                <span>{formatRupiah(biaya.jumlah)}</span> {/* Biaya tambahan langsung locked */}
              </td>
              <td>
                <span style={{ color: "green" }}>✔️</span> {/* Tampilkan tanda centang */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Total Pengeluaran Operasional */}
      <div className="d-flex">
        <p><strong>TOTAL PENGELUARAN OPERASIONAL :</strong></p>
        <p className="ms-auto"><strong>Rp {formatRupiah(hitungTotalBiaya())}</strong></p>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Biaya Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formKategori">
              <Form.Label>Kategori Biaya</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan kategori biaya"
                value={newKategori}
                onChange={(e) => setNewKategori(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formJumlah">
              <Form.Label>Jumlah Biaya</Form.Label>
              <Form.Control
                type="number"
                placeholder="Masukkan jumlah biaya"
                value={newJumlah}
                onChange={(e) => setNewJumlah(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSimpanBiayaTambahan}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BiayaOperasional;