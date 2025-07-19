'use client'

interface StoreInfoProps {
  name?: string
  address?: string
  phone?: string
  openTime?: string
  description?: string
  imagePlaceUrl?: string
  imageMenuUrl?: string
  ownerName?: string
}

export default function StoreInfo({
  name,
  address,
  phone,
  openTime,
  description,
  imagePlaceUrl,
  imageMenuUrl,
  ownerName,
}: StoreInfoProps) {
  return (
    <div>
      <label htmlFor="address">주소</label>
      <p>{address}</p>
      <label>한줄 설명</label>
      <p>{description}</p>
      <label>영업일</label>
      <p>{openTime}</p>
      {/* <img src="" alt="" /> */}
    </div>
  )
}
