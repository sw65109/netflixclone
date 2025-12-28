"use client"

import { CheckIcon } from '@heroicons/react/24/outline'
import { Product } from '@stripe/firestore-stripe-payments'

type ProductMetadata = Record<string, unknown>

function getMeta(product: Product | null | undefined): ProductMetadata {
  const anyProduct = product as unknown as { metadata?: unknown } | null | undefined
  const m = anyProduct?.metadata
  return m && typeof m === 'object' ? (m as ProductMetadata) : {}
}

function getTextMeta(product: Product, key: string): string | null {
  const v = getMeta(product)[key]
  if (v == null) return null
  const s = String(v).trim()
  return s.length ? s : null
}

function getBoolMeta(product: Product, key: string): boolean {
  const v = getMeta(product)[key]
  return String(v ?? '').toLowerCase() === 'true'
}

function formatUsdCents(unitAmount: number | null | undefined) {
  if (typeof unitAmount !== 'number') return '—'
  return `$${(unitAmount / 100).toFixed(2)}`
}

function FeatureRow({
  label,
  render,
  products,
  selectedPlan,
}: {
  label: React.ReactNode
  products: Product[]
  selectedPlan: Product | null
  render: (product: Product) => React.ReactNode
}) {
  return (
    <tr className="tableRow">
      <td className="tableDataTitle">{label}</td>
      {products.map((product) => (
        <td
          key={product.id}
          className={`tableDataFeature ${
            selectedPlan?.id === product.id ? 'text-[#E50914]' : 'text-[gray]'
          }`}
        >
          {render(product)}
        </td>
      ))}
    </tr>
  )
}

interface Props {
  products: Product[]
  selectedPlan: Product | null
}

export default function Table({ products, selectedPlan }: Props) {
  return (
    <table>
      <tbody className="divide-y divide-[gray]">
        <FeatureRow
          label="Monthly price"
          products={products}
          selectedPlan={selectedPlan}
          render={(product) => formatUsdCents(product.prices?.[0]?.unit_amount ?? null)}
        />

        <FeatureRow
          label="Video and sound quality"
          products={products}
          selectedPlan={selectedPlan}
          render={(product) => getTextMeta(product, 'videoQuality') ?? '—'}
        />

        <FeatureRow
          label="Resolution"
          products={products}
          selectedPlan={selectedPlan}
          render={(product) =>
            getTextMeta(product, 'resolution') ?? getTextMeta(product, 'Resolution') ?? '—'
          }
        />

        <FeatureRow
          label="Spatial audio (immersive sound)"
          products={products}
          selectedPlan={selectedPlan}
          render={(product) => (getBoolMeta(product, 'spatialAudio') ? 'Included' : '—')}
        />

        <FeatureRow
          label={
            <>
              Supported devices
              <div className="mt-1 text-xs text-white/60">
                TV, computer, mobile phone, tablet
              </div>
            </>
          }
          products={products}
          selectedPlan={selectedPlan}
          render={(product) =>
            getBoolMeta(product, 'supportedDevices') ? (
              <CheckIcon className="inline-block h-8 w-8" />
            ) : (
              '—'
            )
          }
        />

        <FeatureRow
          label="Devices your household can watch at the same time"
          products={products}
          selectedPlan={selectedPlan}
          render={(product) =>
            getTextMeta(product, 'simultaneousDevices') ??
            getTextMeta(product, 'devicesAtOnce') ??
            '—'
          }
        />

        <FeatureRow
          label="Download devices"
          products={products}
          selectedPlan={selectedPlan}
          render={(product) => getTextMeta(product, 'downloadDevices') ?? '—'}
        />

        <FeatureRow
          label="Ads"
          products={products}
          selectedPlan={selectedPlan}
          render={(product) => getTextMeta(product, 'ads') ?? '—'}
        />
      </tbody>
    </table>
  )
}
