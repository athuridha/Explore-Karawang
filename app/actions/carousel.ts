"use server"

import { query } from "@/lib/mysql"
import crypto from "node:crypto"

export interface CarouselSlide {
  id: string
  title: string
  description: string
  image: string
  button_text_1?: string
  button_link_1?: string
  button_text_2?: string
  button_link_2?: string
  slide_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CarouselInput {
  title: string
  description: string
  image?: string
  buttonText1?: string
  buttonLink1?: string
  buttonText2?: string
  buttonLink2?: string
  slideOrder: number
  isActive: boolean
}

export async function getCarouselSlides() {
  try {
    const result = await query<CarouselSlide>(
      "SELECT * FROM carousel_slides WHERE is_active = TRUE ORDER BY slide_order ASC"
    )
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching carousel slides:", error)
    return { success: false, error: "Failed to fetch carousel slides" }
  }
}

export async function getAllCarouselSlides() {
  try {
    const result = await query<CarouselSlide>(
      "SELECT * FROM carousel_slides ORDER BY slide_order ASC"
    )
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching all carousel slides:", error)
    return { success: false, error: "Failed to fetch carousel slides" }
  }
}

export async function getCarouselSlideById(id: string) {
  try {
    const result = await query<CarouselSlide>(
      "SELECT * FROM carousel_slides WHERE id = ?",
      [id]
    )
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error fetching carousel slide:", error)
    return { success: false, error: "Failed to fetch carousel slide" }
  }
}

export async function addCarouselSlide(data: CarouselInput) {
  try {
    const id = crypto.randomUUID()
    await query(
      `INSERT INTO carousel_slides (
        id, title, description, image, 
        button_text_1, button_link_1, button_text_2, button_link_2, 
        slide_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.description,
        data.image || null,
        data.buttonText1 || null,
        data.buttonLink1 || null,
        data.buttonText2 || null,
        data.buttonLink2 || null,
        data.slideOrder,
        data.isActive,
      ]
    )
    return { success: true, data: { id } }
  } catch (error) {
    console.error("Error adding carousel slide:", error)
    return { success: false, error: "Failed to add carousel slide" }
  }
}

export async function updateCarouselSlide(id: string, data: CarouselInput) {
  try {
    await query(
      `UPDATE carousel_slides SET 
        title = ?, description = ?, image = ?,
        button_text_1 = ?, button_link_1 = ?, button_text_2 = ?, button_link_2 = ?,
        slide_order = ?, is_active = ?
      WHERE id = ?`,
      [
        data.title,
        data.description,
        data.image || null,
        data.buttonText1 || null,
        data.buttonLink1 || null,
        data.buttonText2 || null,
        data.buttonLink2 || null,
        data.slideOrder,
        data.isActive,
        id,
      ]
    )
    return { success: true }
  } catch (error) {
    console.error("Error updating carousel slide:", error)
    return { success: false, error: "Failed to update carousel slide" }
  }
}

export async function deleteCarouselSlide(id: string) {
  try {
    await query("DELETE FROM carousel_slides WHERE id = ?", [id])
    return { success: true }
  } catch (error) {
    console.error("Error deleting carousel slide:", error)
    return { success: false, error: "Failed to delete carousel slide" }
  }
}
