'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type Product = {
  id: string;
  image: string | null;
  itemName: string;
  description: string | null;
  shop: string | null;
  originalPrice: number | string;
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
};

export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [buyerName, setBuyerName] = useState('');
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fulfillmentMethod, setFulfillmentMethod] = useState('PICKUP');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/products');

      /*
       * Depending on NestJS controller,
       * response.data may either be:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * or:
       *
       * {
       *   data: [...]
       * }
       */

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  const submitOffer = async (
    e: React.FormEvent<HTMLFormElement>,
    productId: string,
  ) => {
    e.preventDefault();

    setSubmittingOffer(true);
    setOfferError('');
    setOfferSuccess('');

    try {
      await api.post(`/products/${productId}/offers`, {
        buyerName,
        amount: Number(amount),
        endDate,
        fulfillmentMethod,
        remarks: remarks || undefined,
      });

      setOfferSuccess('Offer submitted successfully.');

      // Clear the form
      setBuyerName('');
      setAmount('');
      setEndDate('');
      setFulfillmentMethod('PICKUP');
      setRemarks('');
    } catch (err: any) {
      console.error(
        'Failed to submit offer:',
        err,
      );

      const message =
        err?.response?.data?.message;

      if (Array.isArray(message)) {
        setOfferError(message.join(', '));
      } else {
        setOfferError(
          message ||
            'Unable to submit offer.',
        );
      }
    } finally {
      setSubmittingOffer(false);
    }
  };


  return (
    <main
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px 60px',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          borderBottom: '1px solid #eee',
          paddingBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: 700,
            }}
          >
            BIDISCOUNT
          </h1>

          <p
            style={{
              margin: '5px 0 0',
              color: '#666',
            }}
          >
            See a product somewhere? Upload it's picture and make an offer. Negotiate the price.
            {/* Find a product. Make an offer. */}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <button
            type="button"
            onClick={() => router.push('/how-it-works')}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => router.push('/products/add')}
            style={{
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '7px',
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Product
          </button>
        </div>


      </header>

      {/* TITLE */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '26px',
          }}
        >
          Products
        </h2>

        <button
          type="button"
          onClick={fetchProducts}
          style={{
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '8px 14px',
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
          }}
        >
          Loading products...
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div
          style={{
            padding: '20px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            marginBottom: '30px',
          }}
        >
          {error}

          <button
            type="button"
            onClick={fetchProducts}
            style={{
              display: 'block',
              marginTop: '12px',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* NO PRODUCTS */}
      {!loading && !error && products.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '70px 20px',
            border: '1px solid #eee',
            borderRadius: '10px',
          }}
        >
          <h3>No products yet</h3>

          <p style={{ color: '#666' }}>
            Be the first person to add a product.
          </p>

          <button
            type="button"
            onClick={() => router.push('/products/add')}
            style={{
              marginTop: '10px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 20px',
              cursor: 'pointer',
            }}
          >
            + Add Product
          </button>
        </div>
      )}

      {/* PRODUCTS */}
      {!loading && !error && products.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)} 
              style={{ border: '1px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden', background: '#fff', cursor: 'pointer', transition: 'box-shadow 0.2s ease, transform 0.2s ease', }} 
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} 
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* IMAGE */}
              <div
                style={{
                  width: '100%',
                  height: '250px',
                  background: '#f5f5f5',
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.itemName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#999',
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* PRODUCT INFORMATION */}
              <div
                style={{
                  padding: '18px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '19px',
                    }}
                  >
                    {product.itemName}
                  </h3>

                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '12px',
                      padding: '4px 7px',
                      borderRadius: '4px',
                      background:
                        product.status === 'AVAILABLE'
                          ? '#dcfce7'
                          : '#fee2e2',
                      color:
                        product.status === 'AVAILABLE'
                          ? '#166534'
                          : '#991b1b',
                    }}
                  >
                    {product.status === 'AVAILABLE'
                      ? 'Available'
                      : 'Not Available'}
                  </span>
                </div>

                {product.shop && (
                  <p
                    style={{
                      margin: '8px 0',
                      color: '#666',
                      fontSize: '14px',
                    }}
                  >
                    Shop: {product.shop}
                  </p>
                )}

                {product.description && (
                  <p
                    style={{
                      margin: '10px 0',
                      color: '#555',
                      fontSize: '14px',
                      lineHeight: 1.5,
                    }}
                  >
                    {product.description}
                  </p>
                )}

                <p
                  style={{
                    margin: '15px 0',
                    fontSize: '20px',
                    fontWeight: 700,
                  }}
                >
                  €{Number(product.originalPrice).toFixed(2)}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

