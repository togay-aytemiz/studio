# AGENTS

## Genel Kurallar

- Basitten basla, gereksiz mimari karmasikliga girme.
- Tek repo, tek deploy oncelikli; ayrisma ihtiyaci dogarsa sonra ele alinir.
- Ortak katmanlar tasarimsiz olmalidir: auth, api client, utils, types.
- Her demo kendi layoutunu kurar; tema ve UI standartlari zorunlu degildir.
- `/validate` sayfasi demo degildir, asla subdomain'e tasinmaz.
- DRY (Don't Repeat Yourself): Ortak mantik birden fazla yerde tekrar ediyorsa
  tasarimsiz ortak katmana alin.

## Iletisim ve Raporlama

- Yapilan her isten sonra:
  - 1 satirlik commit mesaji oner.
  - Yapilan isi plain Turkce acikla.
  - Kalan is varsa belirt; yoksa next step onerisi ver.
