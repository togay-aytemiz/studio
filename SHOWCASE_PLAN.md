# Showcase Plan Dokumani

## Amac

- Tek ana domain altinda farkli subdomainlerde (or: demo1.domain.com, tryon.domain.com)
  farkli demo uygulamalar calistirmak.
- %70 yeni UI/komponent, %30 reusable base layout ve bileşen seti.
- Sunum yerine "canli dene" yaklasimi ile kullanicinin demo uygulamalari
  direkt kullanabilmesi.
- Site içerisinde bu bir showcase'dir, istersen sizin için de yapabiliriz minvalinde yönlendirmeler
- Ana amaç hem ürün kabiliyetimizi göstermek hem de lead convertion focused olmalı.
- www.agens.studio ya da www.agens.studio/validate kısmında kullandığımız fontlardan farklı bambaşka tasarımlar kullanabilmemiz gereken durumlar olabilir ama durumda göre reusa da edebilriz (örneğin convertion focused CTA benzer olur ya da minimal farklar olur gibi)

## Kapsam

- Ayni repo icinde coklu demo uygulama altyapisi.
- Tema degistirilebilir, header/footer opsiyonel.
- Demo tipine gore storage, API, netlify function veya session storage secimi.
- Demo secimi ve yonlendirme (subdomain + fallback path).
- `/validate` sayfasi demo degildir; ana sayfa icindeki bileşendir ve subdomain'e tasinmaz.

## Mimari Oneri (Basit Baslangic)

### 1) Uygulama Katmani (Tek repo, tek build)

- "demo manifest" mantigi ile her demo icin bir config dosyasi.
  Ornek: `src/demos/<demo-slug>/config.ts`
- Her demo icin:
  - `title`, `description`, `theme`, `layout`, `routes`
  - `dataStrategy` (sessionStorage | localStorage | netlifyFunction | externalApi)
  - `featureFlags`
  - `layout` uygulama bazli (her demo kendi layoutunu kurar)

### 2) Routing ve Subdomain (Tek deploy)

- Uygulama tek build, subdomain runtime'da okunur.
- Hostname'den demo slug tespit edilir.
  - `tryon.domain.com` -> slug: tryon
  - `demo.domain.com` -> slug: demo
  - Fallback: `domain.com/demos/tryon`
- Router; slug'a gore ilgili demo sayfalarini yukler.

### 3) Ortak Katman (Tasarımsiz)

- Ortak paylasim: `auth`, `api client`, `utils`, `types`.
- Tasarımsiz katmanlarin UI bagimliligi olmaz.

### 4) Tema ve UI

- Demo icinde UI serbest, tema/komponent standardi zorunlu degil.
- Ileride gerekirse ortak tema/token katmani eklenebilir.

### 5) Data / Storage Secimleri

- Kucuk, kisa omurlu state: `sessionStorage`.
- Demo configuration veya ornek data: JSON ve mock data.
- API gerekirse:
  - Netlify Functions (serverless) ile endpoint saglanir.
  - External API icin `services/` altinda adapter.

### 6) Deploy ve DNS

- Netlify veya benzeri platformda wildcard subdomain destegi.
- DNS kaydi: `*.domain.com` -> Netlify app.
- Netlify settings: SPA rewrite to `index.html`.

## Yapilacak Isler (Phase Plan)

### Phase 1: Basit Altyapi

- Demo manifest yapisi (config dosyalari).
- Subdomain slug tespiti ve routing.
- Ortak "tasarımsiz" katmanlarin dizinleri.

### Phase 2: Ilk Demo Template

- Ilk demo: `tryon` veya `vto` slug (Virtual Try On).
- Demo layoutunun tamamen demo icinde tanimlanmasi.

### Phase 3: Data/Storage Katmani

- `dataStrategy` arayuzu.
- sessionStorage + mock data pattern.
- Netlify function call skeletonu.

### Phase 4: Docs ve Onboarding

- "Yeni demo nasil eklenir" dokumani.
- Demo listesi ve canli linkler.

## Kriterler (Done)

- Subdomain ile demo acilabilir.
- Fallback path ile demo acilabilir.
- Her demo kendi temasini ve layout opsiyonunu kullanir.
- Yeni demo eklemek 15-30 dk icinde tamamlanabilir.

## Riskler

- Subdomain routing yanlis ise path fallback gerekir.
- Tek build + cok demo yapisi bundle size artirabilir.
- Netlify function limitleri belirleyici olabilir.

## Acik Sorular

- Hangi demo tipleri oncelikli?
- Demo'larin auth veya rate limit ihtiyaci var mi?
- Hedef platform sadece Netlify mi?
