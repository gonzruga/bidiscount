'use client';

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AddProductPage() {
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [shop, setShop] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [status, setStatus] = useState<'AVAILABLE' | 'NOT_AVAILABLE'>('AVAILABLE');

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    // event: React.ChangeEvent<HTMLInputElement>,

  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }

    setError('');
    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!image) {
      setError('Please upload a product image.');
      return;
    }

    if (!itemName.trim()) {
      setError('Please enter the item name.');
      return;
    }

    if (!originalPrice || Number(originalPrice) <= 0) {
      setError('Please enter a valid original price.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // IMPORTANT:
      // "image" must match @UploadedFile({ field name: "image" })
      formData.append('image', image);

      formData.append('itemName', itemName);
      formData.append('description', description);
      formData.append('shop', shop);
      formData.append('originalPrice', originalPrice);
      formData.append('status', status);

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Failed to create product.',
        );
      }

      setSuccess('Product added successfully!');

      // Give the user a moment to see the success message,
      // then return to the main page.
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong while creating the product.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: '700px',
        margin: '40px auto',
        padding: '0 20px',
      }}
    >
      <button
        type="button"
        onClick={() => router.push('/')}
        style={{
          marginBottom: '20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
        Add Product
      </h1>

      <p style={{ color: '#666', marginBottom: '30px' }}>
        Add a product that buyers can make an offer on.
      </p>

      <form onSubmit={handleSubmit}>

        {/* IMAGE */}
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="image"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Product Image
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <div style={{ marginTop: '15px' }}>
              <img
                src={preview}
                alt="Product preview"
                style={{
                  width: '220px',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                }}
              />
            </div>
          )}
        </div>

        {/* ITEM NAME */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="itemName"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Item Name
          </label>

          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. iPhone 15 Pro"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px',
            }}
          />
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="description"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product..."
            rows={5}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* SHOP */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="shop"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Shop
          </label>

          <input
            id="shop"
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="e.g. Euronics"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px',
            }}
          />
        </div>

        {/* ORIGINAL PRICE */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="originalPrice"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Original Price
          </label>

          <input
            id="originalPrice"
            type="number"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="e.g. 999.99"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px',
            }}
          />
        </div>

        {/* STATUS */}
        <div style={{ marginBottom: '25px' }}>
          <label
            htmlFor="status"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'AVAILABLE' | 'NOT_AVAILABLE')}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px',
              background: 'white',
            }}
          >
            <option value="AVAILABLE">Available</option>
            <option value="NOT_AVAILABLE">Not Available</option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: '6px',
            }}
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px',
              background: '#dcfce7',
              color: '#166534',
              borderRadius: '6px',
            }}
          >
            {success}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#999' : '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '17px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </main>
  );
}

