import { NextResponse } from 'next/server'
import { addRating, listRatings, getAverageRating } from '@/app/actions/ratings'
import { getOrCreateDeviceId, getClientFingerprint } from '@/lib/device'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const itemType = searchParams.get('item_type') as 'destination' | 'culinary'
  const itemId = searchParams.get('item_id') as string
  if (!itemType || !itemId) {
    return NextResponse.json({ success: false, error: 'Missing item_type or item_id' }, { status: 400 })
  }
  const ratingsRes = await listRatings(itemType, itemId)
  const avgRes = await getAverageRating(itemType, itemId)
  return NextResponse.json({ success: true, ratings: ratingsRes.data || [], summary: avgRes.data })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const deviceId = getOrCreateDeviceId()
    const { ip, ua } = getClientFingerprint()
    const res = await addRating({
      item_type: body.item_type,
      item_id: body.item_id,
      rating: body.rating,
      comment: body.comment,
      media: body.media || []
    }, deviceId, ip, ua)
    if (!res.success) return NextResponse.json(res, { status: 400 })
    return NextResponse.json(res)
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
