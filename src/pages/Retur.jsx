import { useState, useEffect } from "react";
import { Container, Button, Form, Table, Modal } from "react-bootstrap";
import axios from "axios";

const Retur = () => {
  const [returList, setReturList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    noRetur: "",
    namaProduk: "",
    qtyKadaluarsa: "",
    namaSupplier: "",
    alasanRetur: "",
    noBatch: "",
    expDate: "",
    noFakturAsli: "",
    tanggalFaktur: "",
  });
  const [products, setProducts] = useState([]); // State untuk menyimpan daftar produk
  const [suppliers, setSuppliers] = useState([]); // State untuk menyimpan daftar supplier
  const [fakturs, setFakturs] = useState([]); // State untuk menyimpan daftar faktur

  // Fetch data retur, produk, supplier, dan faktur saat komponen di-mount
  useEffect(() => {
    fetchRetur();
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchRetur = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/retur");
      setReturList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data retur:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      console.log("Data produk dari backend:", response.data); // Periksa data di console

      const now = new Date();
      const twoMonthsLater = new Date(now);
      twoMonthsLater.setMonth(now.getMonth() + 2); // 2 bulan dari sekarang

      const filteredProducts = response.data.filter(product => {
        const expDate = new Date(product.exp);
        return expDate <= twoMonthsLater && expDate >= now; // Exp date dalam 2 bulan ke depan
      });

      console.log("Produk yang mendekati exp date:", filteredProducts); // Periksa hasil filter
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data supplier:", error);
    }
  };

  const fetchFaktursBySupplier = async (kodeSupplier) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/faktur?kodeSupplier=${kodeSupplier}`);
      setFakturs(response.data);
    } catch (error) {
      console.error("Gagal mengambil data faktur:", error);
    }
  };

  const generateNoRetur = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/retur/last");
      const lastNoRetur = response.data.lastNoRetur || "RTR000";
      const nextNo = parseInt(lastNoRetur.replace("RTR", "")) + 1;
      const nextNoRetur = "RTR" + nextNo.toString().padStart(3, "0");
      setFormData({ ...formData, noRetur: nextNoRetur });
    } catch (error) {
      console.error("Gagal menghasilkan nomor retur:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "namaSupplier") {
      fetchFaktursBySupplier(value);
    }
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find(product => product.namaProduk === e.target.value);
    if (selectedProduct) {
      setFormData({
        ...formData,
        namaProduk: selectedProduct.namaProduk,
        noBatch: selectedProduct.noBatch,
        qtyKadaluarsa: selectedProduct.stok,
        expDate: selectedProduct.exp.split("T")[0], // Format expDate ke YYYY-MM-DD
      });
    }
  };

  const handleFakturChange = (e) => {
    const selectedFaktur = fakturs.find(faktur => faktur.noFakturAsli === e.target.value);
    if (selectedFaktur) {
      setFormData({
        ...formData,
        noFakturAsli: selectedFaktur.noFakturAsli,
        tanggalFaktur: selectedFaktur.tanggalKirim.split("T")[0], // Format tanggalFaktur ke YYYY-MM-DD
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/retur", formData);
      console.log("Retur berhasil disimpan:", response.data);

      // Reset form dan tutup modal
      setFormData({
        noRetur: "",
        namaProduk: "",
        qtyKadaluarsa: "",
        namaSupplier: "",
        alasanRetur: "",
        noBatch: "",
        expDate: "",
        noFakturAsli: "",
        tanggalFaktur: "",
      });
      setShowModal(false);
      fetchRetur(); // Refresh data retur
    } catch (error) {
      console.error("Gagal menyimpan retur:", error);
    }
  };

  return (
    <Container className="mt-4 Raleway">
      <div className="titleProduct mb-4">
        <h2>RETUR BARANG</h2>
      </div>

      {/* Tombol untuk membuka modal tambah retur */}
      <Button variant="primary" onClick={() => { setShowModal(true); generateNoRetur(); }} className="mb-3">
        Tambah Retur
      </Button>

      {/* Tabel untuk menampilkan data retur */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Produk</th>
            <th>Qty Kadaluarsa</th>
            <th>Nama Supplier</th>
            <th>Alasan Retur</th>
            <th>No Batch</th>
            <th>Exp Date</th>
            <th>No Faktur Asli</th>
            <th>Tanggal Retur</th>
            <th>Tanggal Faktur</th>
          </tr>
        </thead>
        <tbody>
          {returList.map((retur, index) => (
            <tr key={retur._id}>
              <td>{retur.noRetur}</td>
              <td>{retur.namaProduk}</td>
              <td>{retur.qtyKadaluarsa}</td>
              <td>{retur.namaSupplier}</td>
              <td>{retur.alasanRetur}</td>
              <td>{retur.noBatch}</td>
              <td>{new Date(retur.expDate).toLocaleDateString()}</td>
              <td>{retur.noFakturAsli}</td>
              <td>{new Date(retur.tanggalRetur).toLocaleDateString()}</td>
              <td>{new Date(retur.tanggalFaktur).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal untuk menambahkan retur */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>TAMBAH RETUR BARANG</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="noRetur">
              <Form.Label>No Retur</Form.Label>
              <Form.Control
                type="text"
                name="noRetur"
                value={formData.noRetur}
                readOnly
              />
            </Form.Group>
            <div className="d-flex mt-4">
              <Form.Group controlId="namaProduk">
                <Form.Label>Nama Produk</Form.Label>
                <Form.Control
                  as="select"
                  name="namaProduk"
                  value={formData.namaProduk}
                  onChange={handleProductChange}
                  required
                  style={{width: '20rem'}}
                >
                  <option value="">Pilih Produk</option>
                  {products.map((product) => (
                    <option key={product._id} value={product.namaProduk}>
                      {product.namaProduk}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="qtyKadaluarsa" className="ms-auto">
                <Form.Label>Qty </Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    name="qtyKadaluarsa"
                    value={formData.qtyKadaluarsa}
                    onChange={handleInputChange}
                    required
                    readOnly
                    style={{width: '50px'}}
                  />
                  <p className="mb-0 ms-4">pcs</p>
                </div>
              </Form.Group>
            </div>
            <Form.Group controlId="namaSupplier" className="mt-4">
              <Form.Label>Nama Supplier</Form.Label>
              <Form.Control
                as="select"
                name="namaSupplier"
                value={formData.namaSupplier}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier.kode}>
                    {supplier.nama}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="noFakturAsli" className="mt-4">
              <Form.Label>No Faktur Asli</Form.Label>
              <Form.Control
                as="select"
                name="noFakturAsli"
                value={formData.noFakturAsli}
                onChange={handleFakturChange}
                required
              >
                <option value="">Pilih No Faktur</option>
                {fakturs.map((faktur) => (
                  <option key={faktur._id} value={faktur.noFakturAsli}>
                    {faktur.noFakturAsli}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className="d-flex mt-4">
              <Form.Group controlId="noBatch">
                <Form.Label>No Batch</Form.Label>
                <Form.Control
                  type="text"
                  name="noBatch"
                  value={formData.noBatch}
                  onChange={handleInputChange}
                  required
                  readOnly
                  style={{width: '90%'}}
                />
              </Form.Group>
              <Form.Group controlId="expDate">
                <Form.Label>Exp Date</Form.Label>
                <Form.Control
                  type="date"
                  name="expDate"
                  value={formData.expDate}
                  onChange={handleInputChange}
                  required
                  readOnly
                  style={{width: '100%'}}
                />
              </Form.Group>

            </div>
            <Form.Group controlId="tanggalFaktur" className="mt-4">
              <Form.Label>Tanggal Faktur</Form.Label>
              <Form.Control
                type="date"
                name="tanggalFaktur"
                value={formData.tanggalFaktur}
                onChange={handleInputChange}
                required
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="alasanRetur" className="mt-4">
              <Form.Label>Alasan Retur</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="alasanRetur"
                value={formData.alasanRetur}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <button type="submit" className="save mt-4" style={{width: '100%'}}>
              Simpan
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Retur;