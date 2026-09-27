'use client';

import { useRouter } from 'next/navigation';

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <main
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px 70px',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '50px',
          borderBottom: '1px solid #eee',
          paddingBottom: '20px',
        }}
      >
        <div>
          <button
            type="button"
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '28px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            BIDISCOUNT
          </button>

          <p
            style={{
              margin: '5px 0 0',
              color: '#666',
            }}
          >
            See a product. Make an offer.
            {/* See a product somewhere? Upload it's picture and make an offer. Negotiate the price directly with the seller. */}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/')}
          style={{
            background: '#fff',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: '7px',
            padding: '10px 16px',
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          Browse Products
        </button>
      </header>

      {/* INTRO */}
      <section
        style={{
          textAlign: 'center',
          marginBottom: '55px',
        }}
      >
        <h1
          style={{
            margin: '0 0 15px',
            fontSize: '38px',
          }}
        >
          How BIDISCOUNT Works
        </h1>

        <p
          style={{
            maxWidth: '650px',
            margin: '0 auto',
            color: '#666',
            fontSize: '18px',
            lineHeight: 1.6,
          }}
        >
          BIDISCOUNT is a place where buyers can discover products
          and make their own offers instead of simply accepting the
          listed price.
        </p>
      </section>

      {/* STEPS */}
      <section>
        <div
          style={{
            display: 'grid',
            gap: '20px',
          }}
        >
          {/* STEP 1 */}
          <div
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  minWidth: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                1
              </div>

              <div>
                <h2 style={{ margin: '0 0 8px' }}>
                  Find a product
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  Browse products listed on BIDISCOUNT. Open a
                  product to see its description, shop, listed price,
                  availability, and current offers.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  minWidth: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                2
              </div>

              <div>
                <h2 style={{ margin: '0 0 8px' }}>
                  Make an offer
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  Enter your name, the amount you are willing to
                  pay, when your offer expires, and how you would
                  like to receive the product.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  minWidth: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                3
              </div>

              <div>
                <h2 style={{ margin: '0 0 8px' }}>
                  The seller responds
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  The seller can accept your offer, reject it,
                  retract it, or make a counteroffer with a different
                  price or terms.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  minWidth: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                4
              </div>

              <div>
                <h2 style={{ margin: '0 0 8px' }}>
                  Negotiate
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  If the seller sends a counteroffer, the new amount
                  becomes the current offer amount. The offer history
                  keeps track of the previous amounts and actions.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 5 */}
          <div
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  minWidth: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                5
              </div>

              <div>
                <h2 style={{ margin: '0 0 8px' }}>
                  Accept the deal
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  When both sides agree on the offer, the seller can
                  accept it. The accepted offer records the agreed
                  amount and fulfillment method. Money immediately gets deducted from the buyer's account 
                  to seller or held in an escrow account until the fulfillment is completed.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 6 */}
          <div
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  minWidth: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                6
              </div>

              <div>
                <h2 style={{ margin: '0 0 8px' }}>
                  Arrange fulfillment
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  Complete the transaction according to the agreed
                  fulfillment method, such as pickup or delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR SELLERS */}
      <section
        style={{
          marginTop: '55px',
          padding: '30px',
          borderRadius: '12px',
          background: '#f7f7f7',
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Want to sell something?
        </h2>

        <p
          style={{
            color: '#555',
            lineHeight: 1.6,
          }}
        >
          Add a product with its image, description, shop, and
          original price. Once published, buyers can view the
          product and submit offers.
        </p>

        <button
          type="button"
          onClick={() => router.push('/products/add')}
          style={{
            marginTop: '10px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '7px',
            padding: '12px 20px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add Product
        </button>
      </section>

      {/* BACK */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
        }}
      >
        <button
          type="button"
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#555',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          ← Back to products
        </button>
      </div>
    </main>
  );
}