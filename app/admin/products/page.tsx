'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'

type Product = {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  stock: number
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    stock: 0
  })
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    } else {
      fetchProducts()
    }
  }, [isAdmin, router])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      toast.error('Failed to fetch products')
    } else {
      setProducts(data || [])
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()

    if (error) {
      toast.error('Failed to add product')
    } else {
      toast.success('Product added successfully')
      setNewProduct({ name: '', description: '', price: 0, image_url: '', stock: 0 })
      fetchProducts()
    }
  }

  const handleRemoveProduct = async (id: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to remove product')
    } else {
      toast.success('Product removed successfully')
      fetchProducts()
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <>
      <Header onOpenAuth={() => {}}>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
          
          <form onSubmit={handleAddProduct} className="mb-8 space-y-4">
            <h2 className="text-xl font-semibold">Add New Product</h2>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                required
              />
            </div>
            <Button type="submit">Add Product</Button>
          </form>

          <h2 className="text-xl font-semibold mb-4">Current Products</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">${product.price.toFixed(2)} - Stock: {product.stock}</p>
                </div>
                <Button variant="destructive" onClick={() => handleRemoveProduct(product.id)}>Remove</Button>
              </div>
            ))}
          </div>
        </div>
      </Header>
      <Footer />
    </>
  )
}

