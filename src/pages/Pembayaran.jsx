import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import { useLocation } from "react-router-dom"; // Import useLocation

const Pembayaran = () => {
  const [products, setProducts] = useState([]);
  const [racikans, setRacikans] = useState([]);
  const [resepans, setResepans] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalQty, setTotalQty] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [shift, setShift] = useState('');
  const [uangDibayar, setUangDibayar] = useState(0);
  const [kembalian, setKembalian] = useState(0);
  const location = useLocation(); // Dapatkan lokasi saat ini

  // Ambil data cart dari localStorage saat komponen dimuat
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Simpan cart ke localStorage setiap kali cart berubah
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Hapus cart dari localStorage saat pengguna pindah halaman
  useEffect(() => {
    return () => {
      localStorage.removeItem('cart');
    };
  }, [location]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/allProduct`)
      .then(response => {
        setProducts(response.data.products || []);
        setRacikans(response.data.racikans || []);
        setResepans(response.data.resepans || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const allItems = [
    ...products.map((product) => ({
      ...product,
      type: "product",
      label: `${product.namaProduk} - ${product.noBatch} (${new Date(product.exp).toLocaleDateString('id-ID')})`,
      value: product._id,
    })),
    ...racikans.map((racikan) => ({
      ...racikan,
      type: "racikan",
      label: `${racikan.namaRacikan} - (Racikan)`,
      value: racikan._id,
    })),
    ...resepans.map((resep) => ({
      ...resep,
      type: "resep",
      label: `${resep.namaResep} (Resepan)`,
      value: resep._id,
    })),
  ];

  const handleAddToCart = () => {
    if (selectedProduct) {
      const productToAdd =
        products.find((product) => product._id === selectedProduct.value) ||
        racikans.find((racikan) => racikan._id === selectedProduct.value) ||
        resepans.find((resep) => resep._id === selectedProduct.value);

      if (productToAdd) {
        const existingItem = cart.find((item) => item._id === selectedProduct.value);

        if (existingItem) {
          handleUpdateQty(existingItem._id, existingItem.qty + 1);
        } else {
          const isRacikanOrResepan = racikans.some((racikan) => racikan._id === selectedProduct.value) || 
                                    resepans.some((resep) => resep._id === selectedProduct.value);

          const newItem = {
            ...productToAdd,
            qty: 1,
            stok: isRacikanOrResepan ? null : productToAdd.stok,
            exp: isRacikanOrResepan ? null : productToAdd.exp,
            hargaJual: productToAdd.hargaJual || 0,
          };

          setCart((prevCart) => [...prevCart, newItem]);
        }
      }
    }
  };

  const handleUpdateQty = (id, newQty) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  useEffect(() => {
    let qtySum = 0;
    let paymentSum = 0;

    cart.forEach((item) => {
      qtySum += item.qty;
      paymentSum += item.qty * (item.hargaJual || 0);
    });

    setTotalQty(qtySum);
    setTotalPayment(paymentSum);
  }, [cart]);

  useEffect(() => {
    if (metodePembayaran === 'CASH') {
      setKembalian(uangDibayar - totalPayment);
    } else {
      setKembalian(0);
    }
  }, [uangDibayar, totalPayment, metodePembayaran]);

  const handleDone = async () => {
    if (cart.length === 0) {
      alert('Keranjang belanja kosong. Silakan tambahkan produk terlebih dahulu.');
      return;
    }

    if (!metodePembayaran) {
      alert('Metode pembayaran harus dipilih.');
      return;
    }

    if (!shift) {
      alert('Shift harus dipilih');
      return;
    }

    if (metodePembayaran === 'CASH' && uangDibayar < totalPayment) {
      alert('Uang yang dibayarkan kurang dari total pembayaran.');
      return;
    }

    const kodeTransaksi = `TRX-${Date.now()}`;

    const produkDibeli = cart.map((item) => ({
      _id: item._id,
      type: item.type || 'product',
      namaProduk: item.namaProduk || item.namaRacikan || item.namaResep,
      qty: item.qty,
      hargaJual: item.hargaJual,
      hpp: item.hpp || 0,
    }));

    const transactionData = {
      kodeTransaksi,
      produkDibeli,
      metodePembayaran,
      totalPembayaran: totalPayment,
      shift,
      uangDibayar: metodePembayaran === 'CASH' ? uangDibayar : null,
      kembalian: metodePembayaran === 'CASH' ? kembalian : null,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/saveTransaction`, transactionData);
      if (response.status === 201) {
        alert('Transaksi berhasil disimpan!');
        setCart([]);
        setTotalQty(0);
        setTotalPayment(0);
        setShift('');
        setUangDibayar(0);
        setKembalian(0);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Gagal menyimpan transaksi. Silakan coba lagi.');
    }
  };

  return (
    <>
      <Container className="mt-4 Raleway">
        <div className="titleProduct d-flex align-items-center">
          <p className="mb-0">PEMBAYARAN</p>
          <Form.Control as="select" style={{ width: '10%', marginLeft: 'auto'}} value={shift} onChange={(e) => setShift(e.target.value)}>
            <option>Pilih Shift</option>
            <option>Yessi</option>
            <option>Alfi</option>
          </Form.Control>
        </div>

        <Row className="mt-3">
          <Col xs={3}>
            <Form>
              <Form.Group controlId="formProduct" className="mb-3">
                <Form.Label><strong>Nama Produk</strong></Form.Label>
                <div className="d-flex flex-column">
                  <Select
                    options={allItems}
                    value={selectedProduct}
                    onChange={(selectedOption) => setSelectedProduct(selectedOption)}
                    placeholder="Cari produk..."
                    isSearchable
                    noOptionsMessage={() => "Tidak ada produk yang ditemukan"}
                  />
                  <button type="button" className="add mt-2" onClick={handleAddToCart}>
                    <strong>+</strong>
                  </button>
                </div>
              </Form.Group>
              <div className="d-flex justify-content-between">
                <p><strong>TOTAL QTY :</strong></p>
                <p><strong>{totalQty}</strong></p>
              </div>
              <div className="d-flex justify-content-between">
                <p><strong>TOTAL PEMBAYARAN :</strong></p>
                <p><strong>Rp {totalPayment.toLocaleString('id-ID')}</strong></p>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0"><strong>METODE PEMBAYARAN : </strong></p>
                <Form.Control as="select" style={{ width: '25%' }} value={metodePembayaran} onChange={(e) => setMetodePembayaran(e.target.value)}>
                  <option>Pilih</option>
                  <option>CASH</option>
                  <option>QRIS</option>
                </Form.Control>
              </div>
              {metodePembayaran === 'CASH' && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="mb-0"><strong>UANG DIBAYAR : </strong></p>
                  <Form.Control
                    type="number"
                    min="0"
                    value={uangDibayar}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setUangDibayar(value);
                      setKembalian(value - totalPayment);
                    }}
                    style={{ width: '25%' }}
                  />
                </div>
              )}
              {metodePembayaran === 'CASH' && (
                <div className="d-flex justify-content-between"style={{color:'red'}}>
                  <p ><strong>KEMBALIAN :</strong></p>
                  <p><strong>Rp {kembalian.toLocaleString('id-ID')}</strong></p>
                </div>
              )}
              <button className="done" onClick={handleDone}><strong>SELESAI</strong></button>
            </Form>
          </Col>
          <Col xs={9} className="">
            <Card className="cart mt-3">
              <Row className="cart-header ms-2 mt-2 me-2">
                <Col xs={1}><strong>Kode</strong></Col>
                <Col xs={2}><strong>Nama Produk</strong></Col>
                <Col xs={1}><strong>Stok</strong></Col>
                <Col xs={2}><strong>Exp</strong></Col>
                <Col xs={2}><strong>Harga Jual</strong></Col>
                <Col xs={1}><strong>Qty</strong></Col>
                <Col xs={2}><strong>Subtotal</strong></Col>
              </Row>
              <hr />
              {cart.map((item) => (
                <>
                  <Row key={item._id} className="cart-item ms-2 mt-2 me-2">
                    <Col xs={1}>{item.kodeProduk || item.kodeRacikan || item.kodeResep}</Col>
                    <Col xs={2}>{item.namaProduk || item.namaRacikan || item.namaResep}</Col>
                    <Col xs={1}>{item.stok !== null ? item.stok : '-'}</Col>
                    <Col xs={2}>{item.exp ? new Date(item.exp).toLocaleDateString('id-ID') : '-'}</Col>
                    <Col xs={2}>Rp {item.hargaJual?.toLocaleString('id-ID') || '0'}</Col>
                    <Col xs={1}>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateQty(item._id, parseInt(e.target.value))}
                        style={{ width: '50px' }}
                      />
                    </Col>
                    <Col xs={2}>Rp {(item.qty * (item.hargaJual || 0)).toLocaleString('id-ID')}</Col>
                    <Col xs={1}>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveFromCart(item._id)}
                        style={{ padding: '2px 6px', fontSize: '12px' }}
                      >
                        X
                      </Button>
                    </Col>
                  </Row>
                  <hr />
                </>
              ))}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Pembayaran;