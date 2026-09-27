'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type Product = {
  id: string;
  image: string | null;
  itemName: string;
  description: string | null;
  shop: string;
  originalPrice: number | string;
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  createdAt?: string;
  updatedAt?: string;
};


type OfferEventType =
  | 'ACCEPT'
  | 'COUNTEROFFER'
  | 'REJECT'
  | 'RETRACT';

type OfferActorRole =
  | 'BUYER'
  | 'SELLER';

type OfferEvent = {
  id: string;
  offerId: string;
  eventType: OfferEventType;
  actorRole: OfferActorRole;
  amount: number | string | null;
  endDate: string | null;
  remarks: string | null;
  respondsToEventId: string | null;
  createdAt: string;
};

type Offer = {
  id: string;
  productId: string;
  buyerName: string;
  amount: number | string;
  endDate: string;
  fulfillmentMethod:
    | 'PICKUP'
    | 'DELIVERY'
    | 'BOTH';
  remarks: string | null;
  status:
    | 'PENDING'
    | 'NEGOTIATION'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'RETRACTED';
  createdAt: string;
  updatedAt: string;
  events: OfferEvent[];
};


type FulfillmentMethod = 'PICKUP' | 'DELIVERY' | 'BOTH';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);

  // OFFER FORM
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>('PICKUP');
  const [remarks, setRemarks] = useState('');

  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerError, setOfferError] = useState('');
  const [offerSuccess, setOfferSuccess] = useState('');
  const [offersError, setOffersError] = useState('');

  // COUNTER OFFER FORM
const [counterOfferId, setCounterOfferId] = useState<string | null>(null);
const [counterOfferAmount, setCounterOfferAmount] = useState('');
const [counterOfferEndDate, setCounterOfferEndDate] = useState('');
const [counterOfferRemarks, setCounterOfferRemarks] = useState('');
const [counterOfferActorRole, setCounterOfferActorRole] = useState<OfferActorRole>('SELLER');
const [submittingCounterOffer, setSubmittingCounterOffer] = useState(false);
const [counterOfferError, setCounterOfferError] = useState('');

// EVENTS - ACCEPT / REJECT / RETRACT
const [actionOfferId, setActionOfferId] = useState<string | null>(null);
const [actionType, setActionType] = useState<OfferEventType | null>(null);
const [actionRemarks, setActionRemarks] = useState('');
const [submittingAction, setSubmittingAction] = useState(false);
const [actionError, setActionError] = useState('');


  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchOffers();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/products/${productId}`);

      setProduct(response.data);
    } catch (err) {
      console.error('Failed to load product:', err);

      setError('Unable to load this product.');
    } finally {
      setLoading(false);
    }
  };

  const submitOffer = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setOfferError('');
    setOfferSuccess('');

    if (!buyerName.trim()) {
      setOfferError('Please enter your name.');
      return;
    }

    if (!amount || !/^\d+$/.test(amount) || Number(amount) <= 0) {
      setOfferError('Please enter a valid offer amount.');
      return;
    }

    if (!endDate) {
      setOfferError('Please select an offer end date.');
      return;
    }

    try {
      setSubmittingOffer(true);

      const response = await api.post(
        `/products/${productId}/offers`,
        {
          buyerName: buyerName.trim(),
          amount: Number(amount),
          endDate: new Date(endDate).toISOString(),
          fulfillmentMethod,
          remarks: remarks.trim() || undefined,
        },
      );

      console.log('Offer created:', response.data);

      setOfferSuccess(
        'Your offer has been submitted successfully.',
      );

      // Clear form
      setBuyerName('');
      setAmount('');
      setEndDate('');
      setFulfillmentMethod('PICKUP');
      setRemarks('');
      } catch (err: any) {
        console.error('Failed to submit offer:', err);

        console.error('Response:', err?.response?.data);
        console.error('Status:', err?.response?.status);

        const message = err?.response?.data?.message;

        if (Array.isArray(message)) {
          setOfferError(message.join(', '));
        } else {
          setOfferError(
            message || 'Unable to submit your offer.',
          );
        }
      } finally {
        setSubmittingOffer(false);
      }
  };

  // Fetch offers for the product and refreshes UI
  const fetchOffers = async () => {
    if (!productId) return;

    try {
      setOffersLoading(true);
      setOffersError('');

      const response = await api.get(
        `/products/${productId}/offers`,
      );

      setOffers(response.data);
    } catch (err: any) {
      console.error(
        'Failed to fetch offers:',
        err,
      );

      setOffersError(
        err?.response?.data?.message ||
          'Unable to load offers.',
      );
    } finally {
      setOffersLoading(false);
    }
  };


// Calculate current amount
  const getCurrentAmount = (
    offer: Offer,
  ) => {
    const amountEvents = offer.events.filter(
      (event) =>
        event.amount !== null &&
        event.amount !== undefined,
    );

    if (amountEvents.length === 0) {
      return Number(offer.amount);
    }

    return Number(
      amountEvents[amountEvents.length - 1].amount,
    );
  };

  const getLatestAmountEvent = (offer: Offer) => {
  const amountEvents = offer.events.filter(
    (event) =>
      event.amount !== null &&
      event.amount !== undefined,
  );

  if (amountEvents.length === 0) {
    return null;
  }

  return amountEvents[amountEvents.length - 1];
};

const isOfferClosed = (offer: Offer) => {
  return (
    offer.status === 'ACCEPTED' ||
    offer.status === 'REJECTED' ||
    offer.status === 'RETRACTED'
  );
};

  const getStatusLabel = (status: Offer['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';

      case 'NEGOTIATION':
        return 'Negotiation';

      case 'ACCEPTED':
        return 'Accepted';

      case 'REJECTED':
        return 'Rejected';

      case 'RETRACTED':
        return 'Retracted';

      default:
        return status;
    }
  };

  const getEventLabel = (
    eventType: OfferEventType,
  ) => {
    switch (eventType) {
      case 'COUNTEROFFER':
        return 'Counteroffer';

      case 'ACCEPT':
        return 'Accepted';

      case 'REJECT':
        return 'Rejected';

      case 'RETRACT':
        return 'Retracted';

      default:
        return eventType;
    }
  };

  // Add response relationship helper
  const getResponseDescription = (
  event: OfferEvent,
  offer: Offer,
) => {
  if (!event.respondsToEventId) {
    return 'Original Offer';
  }

  const responseEvent = offer.events.find(
    (item) =>
      item.id === event.respondsToEventId,
  );

  if (!responseEvent) {
    return 'Previous event';
  }

  const responseAmount =
    responseEvent.amount !== null &&
    responseEvent.amount !== undefined
      ? `€${Number(
          responseEvent.amount,
        ).toFixed(2)}`
      : '';

  return `${getEventLabel(
    responseEvent.eventType,
  )}${responseAmount ? ` ${responseAmount}` : ''}`;
  };

  // Create a new offer event
  const createOfferEvent = async (
    offer: Offer,
    eventType: OfferEventType,
    actorRole: OfferActorRole,
    amount?: number,
    endDate?: string,
    remarks?: string,
    respondsToEventId?: string,
  ) => {
    try {
      const response = await api.post(
        `/offers/${offer.id}/events`,
        {
          eventType,
          actorRole,
          amount,
          endDate,
          remarks,
          respondsToEventId,
        },
      );

      console.log(
        'Offer event created:',
        response.data,
      );

      await fetchOffers();
    } catch (err: any) {
      console.error(
        'Failed to create offer event:',
        err,
      );

      alert(
        err?.response?.data?.message ||
          'Unable to update offer.',
      );
    }
  };
  

 // Open the action form so Accept, Reject, or Retract can be submitted with optional remarks.
  const openActionForm = (
  offer: Offer,
  eventType: OfferEventType,
  ) => {
  setActionOfferId(offer.id);
  setActionType(eventType);
  setActionRemarks('');
  setActionError('');
  };

const submitOfferAction = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  if (!actionOfferId || !actionType) {
    setActionError('No offer action selected.');
    return;
  }

  try {
    setSubmittingAction(true);
    setActionError('');

    const offer = offers.find(
      (item) => item.id === actionOfferId,
    );

    if (!offer) {
      setActionError('Offer could not be found.');
      return;
    }

    const response = await api.post(
      `/offers/${actionOfferId}/events`,
      {
        eventType: actionType,

        actorRole:
          actionType === 'RETRACT'
            ? 'BUYER'
            : 'SELLER',

        // amount: getCurrentAmount(offer),  // Backend will determine current amount based on previous events, so no need to send it here.

        remarks:
          actionRemarks.trim() || undefined,
      },
    );

    console.log(
      'Offer action created:',
      response.data,
    );

    // Refresh offers/history
    await fetchOffers();

    // Close and reset the action form
    setActionOfferId(null);
    setActionType(null);
    setActionRemarks('');
    setActionError('');
  } catch (err: any) {
    console.error(
      `Failed to submit ${actionType}:`,
      err,
    );

    const message =
      err?.response?.data?.message;

    if (Array.isArray(message)) {
      setActionError(
        message.join(', '),
      );
    } else {
      setActionError(
        message ||
          `Unable to ${
            actionType?.toLowerCase() || 'update'
          } offer.`,
      );
    }
  } finally {
    setSubmittingAction(false);
  }
};


  const submitCounterOffer = async (
  event: React.FormEvent<HTMLFormElement>,
  ) => {
  event.preventDefault();

  setCounterOfferError('');

  if (!counterOfferId) {
    setCounterOfferError(
      'No offer selected for counteroffer.',
    );
    return;
  }

  if (
    !counterOfferAmount ||
    Number(counterOfferAmount) <= 0
  ) {
    setCounterOfferError(
      'Please enter a valid counteroffer amount.',
    );
    return;
  }

  if (!counterOfferEndDate) {
    setCounterOfferError(
      'Please select a counteroffer end date.',
    );
    return;
  }

  try {
    setSubmittingCounterOffer(true);

    const offer = offers.find(
      (item) => item.id === counterOfferId,
    );

    if (!offer) {
      setCounterOfferError(
        'Offer could not be found.',
      );
      return;
    }

    /*
     * Find the latest event that carries an amount.
     *
     * This is the event that represents the current
     * negotiation amount.
     */
    const amountEvents = offer.events.filter(
      (event) =>
        event.amount !== null &&
        event.amount !== undefined,
    );

    const latestAmountEvent =
      amountEvents.length > 0
        ? amountEvents[amountEvents.length - 1]
        : null;

    /*
     * If there is no previous event, the counteroffer
     * responds to the original OFFER.
     *
     * Since the database currently only allows
     * respondsToEventId -> OfferEvent, a first
     * counteroffer has no event to respond to.
     *
     * Therefore this is intentionally undefined.
     */
    const respondsToEventId =
      latestAmountEvent?.id;

    const response = await api.post(
      `/offers/${counterOfferId}/events`,
      {
        eventType: 'COUNTEROFFER',
        actorRole: counterOfferActorRole,
        amount: Number(counterOfferAmount),
        endDate: new Date(
          counterOfferEndDate,
        ).toISOString(),
        remarks:
          counterOfferRemarks.trim() || undefined,
        respondsToEventId,
      },
    );

    console.log(
      'Counteroffer created:',
      response.data,
    );

    // Refresh offers so the new event appears immediately.
    await fetchOffers();

    // Reset form
    setCounterOfferId(null);
    setCounterOfferAmount('');
    setCounterOfferEndDate('');
    setCounterOfferRemarks('');
    setCounterOfferActorRole('SELLER');
    setCounterOfferError('');
  } catch (err: any) {
    console.error(
      'Failed to submit counteroffer:',
      err,
    );

    const message =
      err?.response?.data?.message;

    if (Array.isArray(message)) {
      setCounterOfferError(
        message.join(', '),
      );
    } else {
      setCounterOfferError(
        message ||
          'Unable to submit counteroffer.',
      );
    }
  } finally {
    setSubmittingCounterOffer(false);
  }
  };

  // Loading
  if (loading) {
    return (
      <main
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        <p>Loading product...</p>
      </main>
    );
  }

  // Error
  if (error || !product) {
    return (
      <main
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '30px',
          }}
        >
          ← Back to Products
        </button>

        <div
          style={{
            padding: '30px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
          }}
        >
          {error || 'Product not found.'}
        </div>
      </main>
    );
  }

  const price = Number(product.originalPrice);

  return (
    <main
      style={{
        maxWidth: '1100px',
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
          paddingBottom: '20px',
          borderBottom: '1px solid #eee',
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ← BIDISCOUNT
        </button>

        <button
          onClick={() => router.push('/products/add')}
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '11px 18px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add Product
        </button>
      </header>

      {/* PRODUCT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '50px',
          alignItems: 'start',
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            background: '#f5f5f5',
            borderRadius: '12px',
            overflow: 'hidden',
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
                fontSize: '18px',
              }}
            >
              No Image
            </div>
          )}
        </div>

        {/* PRODUCT DETAILS */}
        <div>
          {/* STATUS */}
          <div
            style={{
              display: 'inline-block',
              padding: '6px 10px',
              borderRadius: '5px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '15px',
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
              ? 'AVAILABLE'
              : 'NOT AVAILABLE'}
          </div>

          {/* ITEM NAME */}
          <h1
            style={{
              margin: '0 0 15px',
              fontSize: '36px',
              lineHeight: 1.2,
            }}
          >
            {product.itemName}
          </h1>

          {/* SHOP */}
          {product.shop && (
            <p
              style={{
                margin: '0 0 25px',
                color: '#666',
                fontSize: '16px',
              }}
            >
              Shop: <strong>{product.shop}</strong>
            </p>
          )}

          {/* PRICE */}
          <div
            style={{
              marginBottom: '30px',
              paddingBottom: '25px',
              borderBottom: '1px solid #eee',
            }}
          >
            <div
              style={{
                color: '#666',
                fontSize: '14px',
                marginBottom: '5px',
              }}
            >
              Original Price
            </div>

            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
              }}
            >
              €{price.toFixed(2)}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginBottom: '35px' }}>
            <h2
              style={{
                fontSize: '20px',
                marginBottom: '12px',
              }}
            >
              Description
            </h2>

            <p
              style={{
                color: '#555',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}
            >
              {product.description ||
                'No description provided.'}
            </p>
          </div>

          {/* MAKE AN OFFER */}
          {!showOfferForm && (
            <button
              type="button"
              disabled={product.status !== 'AVAILABLE'}
              onClick={() => {
                setOfferError('');
                setOfferSuccess('');
                setShowOfferForm(true);
              }}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: '7px',
                background:
                  product.status === 'AVAILABLE'
                    ? '#000'
                    : '#ccc',
                color: '#fff',
                fontSize: '17px',
                fontWeight: 700,
                cursor:
                  product.status === 'AVAILABLE'
                    ? 'pointer'
                    : 'not-allowed',
              }}
            >
              {product.status === 'AVAILABLE'
                ? 'MAKE AN OFFER'
                : 'PRODUCT NOT AVAILABLE'}
            </button>
          )}

          {/* OFFER FORM */}
          {showOfferForm && (
            <div
              style={{
                marginTop: '20px',
                padding: '25px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                background: '#fafafa',
              }}
            >
              <h2
                style={{
                  margin: '0 0 20px',
                  fontSize: '24px',
                }}
              >
                Make an Offer
              </h2>

              <form onSubmit={submitOffer}>
                {/* BUYER NAME */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '7px',
                      fontWeight: 600,
                    }}
                  >
                    Your Name
                  </label>

                  <input
                    type="text"
                    value={buyerName}
                    onChange={(event) =>
                      setBuyerName(event.target.value)
                    }
                    placeholder="Enter your name"
                    maxLength={100}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      fontSize: '15px',
                    }}
                  />
                </div>

                {/* OFFER AMOUNT */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '7px',
                      fontWeight: 600,
                    }}
                  >
                    Offer Amount (€)
                  </label>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === '' || /^\d+$/.test(value)) {
                        setAmount(value);
                      }
                    }}
                    min="1"
                    step="1"
                    placeholder="Enter your offer amount"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      fontSize: '15px',
                    }}
                  />
                </div>

                {/* PAYMENT CARD - DEMO ONLY */}
                <div
                  style={{
                    marginTop: '25px',
                    marginBottom: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid #ddd',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '17px',
                        }}
                      >
                        Payment Details
                      </h3>

                      <p
                        style={{
                          margin: '5px 0 0',
                          fontSize: '13px',
                          color: '#777',
                        }}
                      >
                        Card payment will be available in a future version.
                      </p>
                    </div>

                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: '#f3f4f6',
                        color: '#666',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      DEMO
                    </span>
                  </div>

                  {/* CARD NUMBER */}
                  <div style={{ marginBottom: '15px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '7px',
                        fontWeight: 600,
                      }}
                    >
                      Debit Card Number
                    </label>

                    <input
                      type="text"
                      value="1234 5678 9123"
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '15px',
                        background: '#f3f4f6',
                        color: '#777',
                        cursor: 'not-allowed',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* EXPIRY + CVV */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '15px',
                    }}
                  >
                    {/* EXPIRY */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '7px',
                          fontWeight: 600,
                        }}
                      >
                        Expiry
                      </label>

                      <input
                        type="text"
                        value="10/30"
                        disabled
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ccc',
                          borderRadius: '6px',
                          fontSize: '15px',
                          background: '#f3f4f6',
                          color: '#777',
                          cursor: 'not-allowed',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '7px',
                          fontWeight: 600,
                        }}
                      >
                        CVV
                      </label>

                      <input
                        type="text"
                        value="123"
                        disabled
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ccc',
                          borderRadius: '6px',
                          fontSize: '15px',
                          background: '#f3f4f6',
                          color: '#777',
                          cursor: 'not-allowed',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <p
                    style={{
                      margin: '12px 0 0',
                      fontSize: '12px',
                      color: '#888',
                      lineHeight: 1.5,
                    }}
                  >
                    This is a demonstration only. No payment information is
                    collected or processed.
                  </p>
                </div>

                {/* END DATE */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '7px',
                      fontWeight: 600,
                    }}
                  >
                    Offer Valid Until
                  </label>

                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(event) =>
                      setEndDate(event.target.value)
                    }
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      fontSize: '15px',
                    }}
                  />
                </div>

                {/* FULFILLMENT */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '7px',
                      fontWeight: 600,
                    }}
                  >
                    Fulfillment Method
                  </label>

                  <select
                    value={fulfillmentMethod}
                    onChange={(event) =>
                      setFulfillmentMethod(
                        event.target
                          .value as FulfillmentMethod,
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      fontSize: '15px',
                      background: '#fff',
                    }}
                  >
                    <option value="PICKUP">
                      Pickup
                    </option>
                    <option value="DELIVERY">
                      Delivery
                    </option>
                    <option value="BOTH">
                      Pickup or Delivery
                    </option>
                  </select>
                </div>

                {/* REMARKS */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '7px',
                      fontWeight: 600,
                    }}
                  >
                    Remarks
                  </label>

                  <textarea
                    value={remarks}
                    onChange={(event) =>
                      setRemarks(event.target.value)
                    }
                    placeholder="Additional information..."
                    maxLength={1000}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      fontSize: '15px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* ERROR */}
                {offerError && (
                  <div
                    style={{
                      marginBottom: '15px',
                      padding: '12px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      borderRadius: '6px',
                    }}
                  >
                    {Array.isArray(offerError)
                      ? offerError.join(', ')
                      : offerError}
                  </div>
                )}

                {/* SUCCESS */}
                {offerSuccess && (
                  <div
                    style={{
                      marginBottom: '15px',
                      padding: '12px',
                      background: '#dcfce7',
                      color: '#166534',
                      borderRadius: '6px',
                    }}
                  >
                    {offerSuccess}
                  </div>
                )}

                {/* BUTTONS */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <button
                    type="submit"
                    disabled={submittingOffer}
                    style={{
                      flex: 1,
                      padding: '13px',
                      border: 'none',
                      borderRadius: '6px',
                      background: submittingOffer
                        ? '#999'
                        : '#000',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: submittingOffer
                        ? 'not-allowed'
                        : 'pointer',
                    }}
                  >
                    {submittingOffer
                      ? 'Submitting...'
                      : 'SUBMIT OFFER'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOfferForm(false);
                      setOfferError('');
                      setOfferSuccess('');
                    }}
                    disabled={submittingOffer}
                    style={{
                      padding: '13px 20px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      background: '#fff',
                      fontSize: '15px',
                      cursor: submittingOffer
                        ? 'not-allowed'
                        : 'pointer',
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* OFFERS */}
      <div
        style={{
          marginTop: '60px',
          paddingTop: '35px',
          borderTop: '1px solid #eee',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            marginBottom: '25px',
          }}
        >
          Offers
        </h2>

        {offersLoading && (
          <p>Loading offers...</p>
        )}

        {offersError && (
          <div
            style={{
              padding: '15px',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: '7px',
              marginBottom: '20px',
            }}
          >
            {offersError}
          </div>
        )}

        {!offersLoading &&
          !offersError &&
          offers.length === 0 && (
            <div
              style={{
                padding: '25px',
                border: '1px solid #eee',
                borderRadius: '8px',
                color: '#666',
              }}
            >
              No offers have been submitted yet.
            </div>
          )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
          }}
        >
          {offers.map((offer) => {
            const currentAmount =
              getCurrentAmount(offer);

            return (
              <div
                key={offer.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '25px',
                  background: '#fff',
                }}
              >
                {/* OFFER HEADER */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#777',
                        marginBottom: '5px',
                      }}
                    >
                      ORIGINAL OFFER
                    </div>

                    <div
                      style={{
                        fontSize: '30px',
                        fontWeight: 700,
                      }}
                    >
                      €{Number(offer.amount).toFixed(2)}
                    </div>

                    <div
                      style={{
                        marginTop: '6px',
                        color: '#666',
                      }}
                    >
                      Buyer: {offer.buyerName}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '6px 10px',
                      borderRadius: '5px',
                      background:
                        offer.status === 'ACCEPTED'
                          ? '#dcfce7'
                          : offer.status === 'REJECTED'
                          ? '#fee2e2'
                          : offer.status === 'RETRACTED'
                          ? '#f3f4f6'
                          : '#fef3c7',
                      color:
                        offer.status === 'ACCEPTED'
                          ? '#166534'
                          : offer.status === 'REJECTED'
                          ? '#991b1b'
                          : offer.status === 'RETRACTED'
                          ? '#374151'
                          : '#92400e',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {offer.status}
                  </div>
                </div>

                {/* CURRENT AMOUNT */}
                <div
                  style={{
                    padding: '18px',
                    background: '#f7f7f7',
                    borderRadius: '8px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '5px',
                    }}
                  >
                    CURRENT AMOUNT
                  </div>

                  <div
                    style={{
                      fontSize: '26px',
                      fontWeight: 700,
                    }}
                  >
                    €{currentAmount.toFixed(2)}
                  </div>
                </div>

                {/* ORIGINAL REMARK */}
                {offer.remarks && (
                  <div
                    style={{
                      marginBottom: '20px',
                    }}
                  >
                    <strong>Original remark:</strong>

                    <p
                      style={{
                        margin: '5px 0 0',
                        color: '#555',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {offer.remarks}
                    </p>
                  </div>
                )}

                {/* ACTIONS BUTTONS */}
                {!isOfferClosed(offer) && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginBottom: '30px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openActionForm(offer, 'ACCEPT')
                      }
                      disabled={submittingAction}
                      style={{
                        padding: '10px 16px',
                        cursor: submittingAction
                          ? 'not-allowed'
                          : 'pointer',
                      }}
                    >
                      ACCEPT
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCounterOfferId(offer.id);
                        setCounterOfferAmount(
                          getCurrentAmount(offer).toFixed(2),
                        );
                        setCounterOfferEndDate('');
                        setCounterOfferRemarks('');
                        setCounterOfferActorRole('SELLER');
                        setCounterOfferError('');
                      }}
                      disabled={submittingCounterOffer}
                      style={{
                        padding: '10px 16px',
                        cursor: submittingCounterOffer
                          ? 'not-allowed'
                          : 'pointer',
                      }}
                    >
                      COUNTEROFFER
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openActionForm(offer, 'REJECT')
                      }
                      disabled={submittingAction}
                      style={{
                        padding: '10px 16px',
                        cursor: submittingAction
                          ? 'not-allowed'
                          : 'pointer',
                      }}
                    >
                      REJECT
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openActionForm(offer, 'RETRACT')
                      }
                      disabled={submittingAction}
                      style={{
                        padding: '10px 16px',
                        cursor: submittingAction
                          ? 'not-allowed'
                          : 'pointer',
                      }}
                    >
                      RETRACT
                    </button>
                  </div>
                )}


                {/* COUNTEROFFER FORM */}
                {counterOfferId === offer.id && (
                  <div
                    style={{
                      marginBottom: '30px',
                      padding: '20px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      background: '#fafafa',
                    }}
                  >
                    <h4
                      style={{
                        margin: '0 0 20px',
                        fontSize: '20px',
                      }}
                    >
                      Make a Counteroffer
                    </h4>

                    <form onSubmit={submitCounterOffer}>
                      {/* ACTOR ROLE */}
                      <div
                        style={{
                          marginBottom: '18px',
                        }}
                      >
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '7px',
                            fontWeight: 600,
                          }}
                        >
                          Acting As
                        </label>

                        <select
                          value={counterOfferActorRole}
                          onChange={(event) =>
                            setCounterOfferActorRole(
                              event.target.value as OfferActorRole,
                            )
                          }
                          disabled={submittingCounterOffer}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '15px',
                            background: '#fff',
                          }}
                        >
                          <option value="SELLER">
                            Seller
                          </option>

                          <option value="BUYER">
                            Buyer
                          </option>
                        </select>
                      </div>

                      {/* AMOUNT */}
                      <div
                        style={{
                          marginBottom: '18px',
                        }}
                      >
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '7px',
                            fontWeight: 600,
                          }}
                        >
                          Counteroffer Amount (€)
                        </label>

                        <input
                          type="number"
                          value={counterOfferAmount}
                          onChange={(e) => {
                              const value = e.target.value;

                              if (value === '' || /^\d+$/.test(value)) {
                                setCounterOfferAmount(value);
                              }
                            }}
                            min="1"
                            step="1"
                          required
                          disabled={submittingCounterOffer}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '15px',
                          }}
                        />
                      </div>

                      {/* END DATE */}
                      <div
                        style={{
                          marginBottom: '18px',
                        }}
                      >
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '7px',
                            fontWeight: 600,
                          }}
                        >
                          Counteroffer Valid Until
                        </label>

                        <input
                          type="datetime-local"
                          value={counterOfferEndDate}
                          onChange={(event) =>
                            setCounterOfferEndDate(
                              event.target.value,
                            )
                          }
                          required
                          disabled={submittingCounterOffer}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '15px',
                          }}
                        />
                      </div>

                      {/* REMARKS */}
                      <div
                        style={{
                          marginBottom: '18px',
                        }}
                      >
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '7px',
                            fontWeight: 600,
                          }}
                        >
                          Remark
                        </label>

                        <textarea
                          value={counterOfferRemarks}
                          onChange={(event) =>
                            setCounterOfferRemarks(
                              event.target.value,
                            )
                          }
                          placeholder="Optional remark..."
                          maxLength={1000}
                          rows={4}
                          disabled={submittingCounterOffer}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '15px',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      {/* ERROR */}
                      {counterOfferError && (
                        <div
                          style={{
                            marginBottom: '15px',
                            padding: '12px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '6px',
                          }}
                        >
                          {counterOfferError}
                        </div>
                      )}

                      {/* BUTTONS */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                        }}
                      >
                        <button
                          type="submit"
                          disabled={submittingCounterOffer}
                          style={{
                            padding: '12px 18px',
                            border: 'none',
                            borderRadius: '6px',
                            background: submittingCounterOffer
                              ? '#999'
                              : '#000',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: submittingCounterOffer
                              ? 'not-allowed'
                              : 'pointer',
                          }}
                        >
                          {submittingCounterOffer
                            ? 'Submitting...'
                            : 'SUBMIT COUNTEROFFER'}
                        </button>

                        <button
                          type="button"
                          disabled={submittingCounterOffer}
                          onClick={() => {
                            setCounterOfferId(null);
                            setCounterOfferAmount('');
                            setCounterOfferEndDate('');
                            setCounterOfferRemarks('');
                            setCounterOfferError('');
                          }}
                          style={{
                            padding: '12px 18px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            background: '#fff',
                            fontWeight: 600,
                            cursor: submittingCounterOffer
                              ? 'not-allowed'
                              : 'pointer',
                          }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {actionOfferId === offer.id &&
                  actionType && (
                    <form
                      onSubmit={submitOfferAction}
                      style={{
                        marginTop: '20px',
                        padding: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        background: '#fafafa',
                      }}
                    >
                      <h4 style={{ marginTop: 0 }}>
                        {actionType === 'ACCEPT' &&
                          'Accept Offer'}

                        {actionType === 'REJECT' &&
                          'Reject Offer'}

                        {actionType === 'RETRACT' &&
                          'Retract Offer'}
                      </h4>

                      <p
                        style={{
                          marginTop: 0,
                          color: '#666',
                        }}
                      >
                        Add an optional remark before submitting.
                      </p>

                      <div style={{ marginBottom: '12px' }}>
                        <label
                          htmlFor={`action-remarks-${offer.id}`}
                          style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: 600,
                          }}
                        >
                          Remark (optional)
                        </label>

                        <textarea
                          id={`action-remarks-${offer.id}`}
                          value={actionRemarks}
                          onChange={(e) =>
                            setActionRemarks(e.target.value)
                          }
                          placeholder="Add a remark..."
                          maxLength={1000}
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {actionError && (
                        <p
                          style={{
                            color: 'red',
                            marginBottom: '12px',
                          }}
                        >
                          {actionError}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                        }}
                      >
                        <button
                          type="submit"
                          disabled={submittingAction}
                          style={{
                            padding: '10px 16px',
                            cursor: submittingAction
                              ? 'not-allowed'
                              : 'pointer',
                          }}
                        >
                          {submittingAction
                            ? 'SUBMITTING...'
                            : `SUBMIT ${actionType}`}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActionOfferId(null);
                            setActionType(null);
                            setActionRemarks('');
                            setActionError('');
                          }}
                          disabled={submittingAction}
                          style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                          }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

{/* Current getCurrentAmount() has a subtle issue after an ACCEPT, REJECT, or RETRACT. Because those events also contain amount, will include terminal events too. */}
{/* terminal events inherit the current amount correctly on the backend, i.ethe backend remains the source of truth for the current amount. */}


                {/* EVENT HISTORY */}
                <div>
                  <h3
                    style={{
                      fontSize: '19px',
                      marginBottom: '15px',
                    }}
                  >
                    Offer History
                  </h3>

                  {offer.events.length === 0 ? (
                    <p
                      style={{
                        color: '#777',
                      }}
                    >
                      No negotiation events yet.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {/* {offer.events.map((event) => (
                        <div
                          key={event.id}
                          style={{
                            padding: '15px',
                            borderLeft:
                              '3px solid #ddd',
                            background: '#fafafa',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent:
                                'space-between',
                              gap: '15px',
                            }}
                          >
                            <strong>
                              {event.eventType}
                            </strong>

                            <span
                              style={{
                                color: '#777',
                                fontSize: '13px',
                              }}
                            >
                              {new Date(
                                event.createdAt,
                              ).toLocaleString()}
                            </span>
                          </div>

                          <div
                            style={{
                              marginTop: '5px',
                              fontSize: '13px',
                              color: '#666',
                            }}
                          >
                            {event.actorRole}
                          </div>

                          {event.eventType ===
                            'COUNTEROFFER' && (
                            <>
                              <div
                                style={{
                                  marginTop: '8px',
                                  fontSize: '20px',
                                  fontWeight: 700,
                                }}
                              >
                                €
                                {Number(
                                  event.amount,
                                ).toFixed(2)}
                              </div>

                              {event.endDate && (
                                <div
                                  style={{
                                    marginTop: '5px',
                                    color: '#666',
                                    fontSize: '14px',
                                  }}
                                >
                                  Valid until:{' '}
                                  {new Date(
                                    event.endDate,
                                  ).toLocaleString()}
                                </div>
                              )}
                            </>
                          )}

                          {event.eventType !==
                            'COUNTEROFFER' &&
                            event.amount !== null && (
                              <div
                                style={{
                                  marginTop: '8px',
                                  fontSize: '18px',
                                  fontWeight: 600,
                                }}
                              >
                                €
                                {Number(
                                  event.amount,
                                ).toFixed(2)}
                              </div>
                            )}

                          {event.remarks && (
                            <div
                              style={{
                                marginTop: '8px',
                                color: '#555',
                              }}
                            >
                              {event.remarks}
                            </div>
                          )}
                        </div>
                      ))} */}

                      <div
                        style={{
                          marginTop: '25px',
                        }}
                      >
                        <h4>
                          Offer History
                        </h4>

                        {/* ORIGINAL OFFER */}
                        <div
                          style={{
                            position: 'relative',
                            marginBottom: '20px',
                            padding: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            background: '#fff',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              marginBottom: '8px',
                            }}
                          >
                            ORIGINAL OFFER
                          </div>

                          <div
                            style={{
                              fontSize: '13px',
                              color: '#666',
                              marginBottom: '10px',
                            }}
                          >
                            Buyer: {offer.buyerName}
                          </div>

                          <div
                            style={{
                              fontSize: '22px',
                              fontWeight: 700,
                              marginBottom: '10px',
                            }}
                          >
                            €{Number(offer.amount).toFixed(2)}
                          </div>

                          <div
                            style={{
                              fontSize: '14px',
                              marginBottom: '6px',
                            }}
                          >
                            Valid until:{' '}
                            {new Date(
                              offer.endDate,
                            ).toLocaleString()}
                          </div>

                          {offer.remarks && (
                            <div
                              style={{
                                marginTop: '10px',
                              }}
                            >
                              <strong>Remark:</strong>{' '}
                              {offer.remarks}
                            </div>
                          )}

                          <div
                            style={{
                              marginTop: '10px',
                              fontSize: '12px',
                              color: '#777',
                            }}
                          >
                            Created:{' '}
                            {new Date(
                              offer.createdAt,
                            ).toLocaleString()}
                          </div>
                        </div>

                        {/* EVENTS */}
                        {offer.events.map(
                          (event, index) => (
                            <div
                              key={event.id}
                              style={{
                                position: 'relative',
                                marginLeft: '20px',
                                marginBottom: '20px',
                                paddingLeft: '20px',
                                borderLeft:
                                  '2px solid #ccc',
                              }}
                            >
                              {/* Connector */}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: '-7px',
                                  top: '0',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: '#fff',
                                  border: '2px solid #777',
                                }}
                              />

                              <div
                                style={{
                                  padding: '16px',
                                  border: '1px solid #ddd',
                                  borderRadius: '8px',
                                  background: '#fafafa',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent:
                                      'space-between',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '10px',
                                  }}
                                >
                                  <strong>
                                    {getEventLabel(
                                      event.eventType,
                                    ).toUpperCase()}
                                  </strong>

                                  <span
                                    style={{
                                      fontSize: '12px',
                                      color: '#666',
                                    }}
                                  >
                                    {new Date(
                                      event.createdAt,
                                    ).toLocaleString()}
                                  </span>
                                </div>

                                {/* ACTOR */}
                                <div
                                  style={{
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                  }}
                                >
                                  <strong>Actor:</strong>{' '}
                                  {event.actorRole}
                                </div>

                                {/* AMOUNT */}
                                {event.amount !== null && (
                                  <div
                                    style={{
                                      fontSize: '20px',
                                      fontWeight: 700,
                                      marginBottom: '8px',
                                    }}
                                  >
                                    €{Number(
                                      event.amount,
                                    ).toFixed(2)}
                                  </div>
                                )}

                                {/* VALID UNTIL */}
                                {event.endDate && (
                                  <div
                                    style={{
                                      marginBottom: '8px',
                                      fontSize: '14px',
                                    }}
                                  >
                                    <strong>
                                      Valid until:
                                    </strong>{' '}
                                    {new Date(
                                      event.endDate,
                                    ).toLocaleString()}
                                  </div>
                                )}

                                {/* RESPONSE RELATIONSHIP */}
                                {event.eventType ===
                                  'COUNTEROFFER' && (
                                  <div
                                    style={{
                                      marginBottom: '8px',
                                      fontSize: '14px',
                                    }}
                                  >
                                    <strong>
                                      Responds to:
                                    </strong>{' '}
                                    {getResponseDescription(
                                      event,
                                      offer,
                                    )}
                                  </div>
                                )}

                                {/* REMARK */}
                                {event.remarks && (
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      padding: '10px',
                                      background: '#fff',
                                      borderRadius: '6px',
                                    }}
                                  >
                                    <strong>
                                      Remark:
                                    </strong>{' '}
                                    {event.remarks}
                                  </div>
                                )}
                              </div>

                              {/* ARROW TO NEXT EVENT */}
                              {index <
                                offer.events.length - 1 && (
                                <div
                                  style={{
                                    marginTop: '8px',
                                    marginBottom: '8px',
                                    marginLeft: '0',
                                    fontSize: '18px',
                                    color: '#777',
                                  }}
                                >
                                  ↓
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>

                    </div>
                  )}
                </div>
              </div>
            );
          })}  
        </div>
      </div>


      {/* BACK BUTTON */}
      <div
        style={{
          marginTop: '50px',
          paddingTop: '25px',
          borderTop: '1px solid #eee',
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '11px 18px',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          ← Back to Products
        </button>
      </div>
    </main>
  );
}