'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { agreementSchema, AgreementSchemaType } from 'models/schemas/auth.schema'
import { useForm } from 'react-hook-form'

export default function AgreementPage() {
  const form = useForm<AgreementSchemaType>({
    resolver: zodResolver(agreementSchema),
    mode: 'all',
  })

  const handleSubmit = (data: AgreementSchemaType) => {
    console.log(data)
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <label>
          <input type="checkbox" />
          전체 동의합니다
        </label>

        <div>
          <label>
            <input type="checkbox" />
            약관에 동의합니다
          </label>
          <pre></pre>
        </div>
      </form>
    </div>
  )
}
