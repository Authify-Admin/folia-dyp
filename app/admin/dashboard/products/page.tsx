'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Search,
  Package,
} from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/types';
import { productOperations } from '@/lib/firestore';
import { uploadProductImages, deleteProductImages } from '@/lib/storage';
import { ImageUpload } from '@/components/ImageUpload';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  Spinner,
  Table,
  TD,
  TH,
  THead,
  Textarea,
  TR,
} from '@/components/admin/ui';

interface ImageFile {
  file: File | null;
  url: string;
  id: string;
  order: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [useVariants, setUseVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
    quantity: '',
    category: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth');
      if (!auth) {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
        loadProducts();
      }
    }
  }, [router]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await productOperations.getAll();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', price: 0, quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate variants if enabled
      if (useVariants && variants.length === 0) {
        alert('Please add at least one variant or disable variants mode.');
        setSubmitting(false);
        return;
      }

      if (editingProduct) {
        // Update existing product
        const updates: Partial<Product> = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          hasVariants: useVariants,
        };

        if (useVariants) {
          updates.variants = variants;
          // Set default price/weight from first variant
          updates.price = variants[0].price;
          updates.weight = variants[0].size;
          updates.quantity = variants.reduce((sum, v) => sum + v.quantity, 0);
        } else {
          updates.price = parseFloat(formData.price);
          updates.weight = formData.weight;
          updates.quantity = parseInt(formData.quantity);
          updates.variants = undefined;
        }

        // Reconcile images: upload any newly added files, KEEP existing image
        // URLs, preserving the on-screen order. Upload happens before any write
        // and we never pre-delete, so a failed upload can't wipe existing
        // images (the old destructive delete-then-upload is gone).
        const newFiles = images
          .filter(img => img.file !== null)
          .map(img => img.file!);
        let uploadedUrls: string[] = [];
        if (newFiles.length > 0) {
          const uploaded = await uploadProductImages(editingProduct.id, newFiles);
          uploadedUrls = uploaded.map(img => img.url);
        }
        let nextNew = 0;
        const finalUrls = images
          .map(img => (img.file !== null ? uploadedUrls[nextNew++] : img.url))
          .filter(Boolean);
        updates.images = finalUrls;
        updates.image = finalUrls[0] || '';

        await productOperations.update(editingProduct.id, updates);
        alert('Product updated successfully!');
      } else {
        // Create the product FIRST to obtain its real Firestore id, then upload
        // images under products/<realId>/ — so they live with the product and
        // stay deletable, instead of an orphaned temp_<timestamp> folder.
        const newProduct: Omit<Product, 'id'> = {
          name: formData.name,
          description: formData.description,
          image: '',
          images: [],
          category: formData.category,
          hasVariants: useVariants,
          price: useVariants ? variants[0].price : parseFloat(formData.price),
          weight: useVariants ? variants[0].size : formData.weight,
          quantity: useVariants ? variants.reduce((sum, v) => sum + v.quantity, 0) : parseInt(formData.quantity),
          variants: useVariants ? variants : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newId = await productOperations.create(newProduct);

        const filesToUpload = images
          .filter(img => img.file !== null)
          .map(img => img.file!);
        if (filesToUpload.length > 0) {
          const uploaded = await uploadProductImages(newId, filesToUpload);
          const imageUrls = uploaded.map(img => img.url);
          await productOperations.update(newId, {
            images: imageUrls,
            image: imageUrls[0] || '',
          });
        }
        alert('Product added successfully!');
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      weight: product.weight,
      quantity: product.quantity.toString(),
      category: product.category,
    });

    // Load variants if product has them
    if (product.hasVariants && product.variants) {
      setUseVariants(true);
      setVariants(product.variants);
    } else {
      setUseVariants(false);
      setVariants([]);
    }

    // Load existing images
    if (product.images && product.images.length > 0) {
      const existingImages: ImageFile[] = product.images.map((url, index) => ({
        file: null,
        url,
        id: `existing_${index}`,
        order: index,
      }));
      setImages(existingImages);
    } else if (product.image) {
      setImages([{ file: null, url: product.image, id: 'existing_0', order: 0 }]);
    } else {
      setImages([]);
    }

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also delete all associated images.')) {
      return;
    }

    try {
      await deleteProductImages(id);
      await productOperations.delete(id);
      alert('Product deleted successfully!');
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', weight: '', quantity: '', category: '' });
    setImages([]);
    setUseVariants(false);
    setVariants([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <>
      <PageHeader
        title="Products"
        description="Add, edit, and manage your product inventory."
        actions={
          !showForm && (
            <Button onClick={openNewForm}>
              <Plus className="h-4 w-4" />
              Add product
            </Button>
          )
        }
      />

      {/* Product form */}
      {showForm && (
        <Card className="mb-6">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            {editingProduct ? 'Edit product' : 'Add new product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Product name" htmlFor="name" required>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Field>

              <Field label="Category" htmlFor="category" required>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Organic Fertilizers">Organic Fertilizers</option>
                  <option value="Soil & Amendments">Soil &amp; Amendments</option>
                  <option value="Plant Boosters">Plant Boosters</option>
                </Select>
              </Field>
            </div>

            {/* Variants toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <input
                type="checkbox"
                checked={useVariants}
                onChange={(e) => setUseVariants(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-green-900">
                This product has multiple size/weight variants (e.g. 100g, 500g, 1kg)
              </span>
            </label>

            {useVariants ? (
              <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Product variants</h3>
                  <Button type="button" onClick={addVariant} size="sm">
                    <Plus className="h-4 w-4" />
                    Add variant
                  </Button>
                </div>

                {variants.length === 0 ? (
                  <p className="py-4 text-center text-sm text-slate-500">
                    No variants added. Click &ldquo;Add variant&rdquo; to add size options.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className="flex items-end gap-3 rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <Field label="Size / Weight" className="flex-1" required>
                          <Input
                            value={variant.size}
                            onChange={(e) => updateVariant(index, 'size', e.target.value)}
                            placeholder="e.g. 1kg, 500g"
                            required
                          />
                        </Field>
                        <Field label="Price (₹)" className="flex-1" required>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                            required
                          />
                        </Field>
                        <Field label="Stock" className="flex-1" required>
                          <Input
                            type="number"
                            value={variant.quantity}
                            onChange={(e) => updateVariant(index, 'quantity', parseInt(e.target.value))}
                            required
                          />
                        </Field>
                        <Button
                          type="button"
                          onClick={() => removeVariant(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          aria-label="Remove variant"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Price (₹)" htmlFor="price" required>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Weight / Volume" htmlFor="weight" required>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 500g, 1kg, 2L"
                    required
                  />
                </Field>
                <Field label="Quantity in stock" htmlFor="quantity" required>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </Field>
              </div>
            )}

            <Field
              label="Description"
              htmlFor="description"
              required
              hint="Tip: start with a tagline, then details. Lines beginning with • become key benefits on the product page."
            >
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </Field>

            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>
                {submitting
                  ? editingProduct ? 'Updating…' : 'Adding…'
                  : editingProduct ? 'Update product' : 'Add product'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search products by name or category…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Products list */}
      <Card padded={false}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            All products{' '}
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {filteredProducts.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <Spinner label="Loading products…" />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No products found"
            description={searchTerm ? 'Try a different search.' : 'Add your first product to get started.'}
            action={!searchTerm && <Button onClick={openNewForm}><Plus className="h-4 w-4" />Add product</Button>}
          />
        ) : (
          <Table>
            <THead>
              <TH>Product</TH>
              <TH>Category</TH>
              <TH>Price</TH>
              <TH>Weight</TH>
              <TH>Stock</TH>
              <TH>Analytics</TH>
              <TH className="text-right">Actions</TH>
            </THead>
            <tbody>
              {filteredProducts.map((product) => {
                const clicks = product.analytics?.clicks || 0;
                const conv = product.analytics?.conversions || 0;
                return (
                  <TR key={product.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-slate-100">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{product.name}</p>
                          {product.images && product.images.length > 1 && (
                            <p className="text-xs text-slate-400">{product.images.length} images</p>
                          )}
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <Badge tone="green">{product.category}</Badge>
                    </TD>
                    <TD className="font-medium text-slate-900">₹{product.price.toFixed(2)}</TD>
                    <TD className="text-slate-500">{product.weight}</TD>
                    <TD>
                      <Badge
                        tone={product.quantity === 0 ? 'red' : product.quantity < 10 ? 'amber' : 'green'}
                      >
                        {product.quantity === 0 ? 'Sold out' : `${product.quantity} units`}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span title="Views">👁 {clicks}</span>
                        <span title="Added to cart">🛒 {product.analytics?.addedToCart || 0}</span>
                        <span title="Sold">✅ {conv}</span>
                        {clicks > 0 && (
                          <span className="text-slate-400">· {((conv / clicks) * 100).toFixed(0)}%</span>
                        )}
                      </div>
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="secondary"
                          size="sm"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
