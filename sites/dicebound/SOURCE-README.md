# Dicebound — taşınabilir statik web sitesi

Hedef: **https://dicebound.agens.studio**  
Destek: **hello@agens.studio**

Bu paket ayrı Agens reposuna taşınmak içindir. Burada site yayınlanmadı, DNS veya ajans reposu değiştirilmedi.
Node, npm, veritabanı, JavaScript, Supabase veya build adımı gerekmez. HTML/CSS doğrudan düzenlenebilir.

## Diğer repoya taşıma

1. Bu klasörü diğer repoya örneğin `sites/dicebound/` olarak kopyala.
2. `dicebound.agens.studio` için yayın kökünü bu klasörün **public/** dizinine yönlendir. Mevcut ajans sayfalarının üstüne yazma.
3. HTTPS etkin olsun. `/` → `index.html`, `/tr/` → `tr/index.html` sunulmalı. Diğer sayfalar gerçek `.html` dosyalarıdır; SPA rewrite gerekmez.
4. Hosting sağlayıcına uygun HTTP başlıklarını uygula (aşağıda). Tüm bilinmeyen yolları ana sayfaya döndürme; 404 dön.
5. Tam domain üzerinde sayfaları, e-posta bağlantısını ve dil geçişini kontrol et. `config/ios.json` adresi login, bot challenge veya yönlendirme istemeden erişilebilir olmalı.

Yayınlanacak olan yalnızca `public/` içeriği. README, `asset-provenance.json`, araçlar ve arşiv çıktıları web kökünün dışında kalmalı. Kendi repo yapına göre klasör adını değiştirebilirsin; sayfa içindeki yerel bağlantılar görecelidir. Canonical/sitemap domain'i hazır olarak `dicebound.agens.studio` kullanır.

## Hazır sayfalar ve Store adresleri

| İçerik | English | Türkçe |
|---|---|---|
| Ana sayfa | `/` | `/tr/` |
| Gizlilik | `/privacy.html` | `/tr/privacy.html` |
| Destek | `/support.html` | `/tr/support.html` |
| İletişim | `/contact.html` | `/tr/contact.html` |

App Store EN Privacy Policy URL: `https://dicebound.agens.studio/privacy.html`  
App Store TR Privacy Policy URL: `https://dicebound.agens.studio/tr/privacy.html`  
Support URL: aynı dildeki `support.html`. Bunlar yayın sonrasında kullanılacak hedef adreslerdir; şu anda canlı oldukları iddia edilmez.

Dil seçimi açık bağlantılarla yapılır, mevcut belge korunur; çerez/localStorage kullanılmaz. Ana sayfa varsayılan İngilizcedir. Reklam/analitik, dış font/CDN, form veya gerçek mağaza adresi bilinmediği için sahte indirme düğmesi yoktur.

## Yerel önizleme

Bu klasörde:

```sh
python3 -m http.server 8830 --bind 127.0.0.1 --directory public
```

`http://127.0.0.1:8830/` ve `/tr/` açılır. Dosyalar doğrudan `file://` ile de temel olarak gezilebilir, ancak HTTP kontrolü tercih edilir. Python'un basit sunucusu `_headers`/`.htaccess` uygulamaz; header doğrulaması gerçek host üzerinde yapılmalıdır.

## Sürüm kuralı

Dosya: `public/config/ios.json`. Menüye veya sitemap'e eklenmez. **Bilerek bağlı değildir:** `applicationId` boş olduğu için oyunun mevcut kimlik doğrulaması bu kuralı kabul etmez. Mevcut oyunda da güncelleme özelliği kapalıdır. Dosyanın sunulması hiçbir oyuncuyu engellemez.

Gerçek App Store uygulaması hazır olduğunda:

1. `applicationId` alanını gerçek production bundle ID ile doldur. Geliştirme kimliğini kendiliğinden production kabul etme.
2. `minimumVersion` değerini izin verilen en eski marketing sürümüne ayarla (ör. `1.0.1`). `revision` pozitif ve her değişiklikte artan sayı olmalı.
3. Oyun reposundaki `app-update.json` için `policyUrl` = `https://dicebound.agens.studio/config/ios.json`, gerçek App Store URL'si ve `enabled: true` ayarlanmalı. Web paketi oyun yapılandırmasını değiştirmez.
4. Mağaza sürümü ilgili ülkelerde/cihazlarda indirilebilir olduktan sonra minimumu yükselt. Aynı marketing sürümündeki build numaraları mevcut kontrol tarafından ayrı zorunlu tutulmaz.
5. Yanlış minimumu geri almak için daha yüksek `revision` ile daha düşük minimum yayımla; aynı revision'ı tekrar kullanma. Cihaz yeni kuralı bağlantı kurunca öğrenir.

Yanıt HTTP200, `Content-Type: application/json`, `Cache-Control: no-store` ve `X-Robots-Tag: noindex` olmalı. Redirect/HTML/login/bot challenge olmamalı. CDN'de eski JSON'u tutma. HTTPS okuma herkese açık; yazma yalnızca yayınlama yetkisi olan ekipte. Dosya gizli değildir, içinde parola/anahtar bulunmamalı. `noindex` arama indeksini hedefler; erişim engeli değildir. `robots.txt` içinde engellemedik, böylece arama motorları noindex başlığını okuyabilir.

## Hosting başlıkları

- Cloudflare Pages/Netlify benzeri `_headers` destekleyen statik hostlar: hazır `public/_headers`.
- Apache: hazır `public/.htaccess` (AllowOverride ve mod_headers host tarafından açık olmalı).
- Nginx/ajans framework'ü/diğer host: aynı kuralları host yapılandırmasına taşı. JSON için en az `Cache-Control: no-store`, `X-Robots-Tag: noindex` ve doğru MIME tipi; HTML/CSS/font/WebP için doğru MIME tipleri gerekir.
- Güvenlik başlıkları external script/embed kullanımına kapalıdır. Ana ajans sitesinin çerez/analitik enjeksiyonunu bu subdomain'e otomatik uygulama; eklenirse gizlilik metni ve CSP güncellenmelidir.
- Siteyi sadece ana domainin SPA fallthrough'u ile sunma: `/config/ios.json` mutlaka JSON dönmeli.

## İçerik ve görseller

Header V04 ana sayfada görsel üzerinde şeffaftır; mobilde menü içerik akışında kalır. Altın buton yüzeyi özgün SVG doku ve CSS ile oluşturulur. Hero V03, seçilen görsel taslağa uygun özgün karakter/ortam artwork’ü ile oyunun mevcut kartlarını ve Blender zarlarını birleştirir. EN/TR başlıkları ve düğme erişilebilir HTML olarak kalır; mobilde karakterlere odaklanan ayrı bir kadraj kullanılır. Diğer bölümlerde onaylı Dicebound kompozisyonlarının ayrı pazarlama yazıları çıkarılarak üretilen görseller korunur. Oyun ekranlarının içindeki mevcut İngilizce UI korunur. `assets/` içindeki WebP, yerel Alegreya fontu ve RogueDie favicon'u pakete dahildir. Fontun OFL lisansı `public/assets/FONT-LICENSE.txt` içindedir. Görsellerin kökeni/hash'leri `asset-provenance.json` dosyasında kayıtlıdır.

`tools/export-art.cjs` yalnızca özgün Dicebound reposunda yeniden görsel dışa aktarmak içindir; taşınan sitenin çalışması için kullanılmaz, silinebilir. Başka repoda bütün gerekli web görselleri zaten `public/assets` içinde vardır. Native/gameplay ekranları arşivdeki onaylı pazarlama kaynaklarıdır; App Store ekran görüntüsü tesliminin güncel capture adımı bu web paketinden ayrıdır.

Gizlilik sayfaları oyundaki mevcut EN/TR politikalarına dayanır; site trafiği ve isteğe bağlı sürüm kontrolü açıklamaları eklendi. Adres/email sahibi tarafından sağlandı. Yayın öncesinde ajansın gerçek hosting/log saklama uygulamalarıyla metni eşleştir; gerçek işletmeci için gerekli ek kurumsal bilgileri ajansın mevcut kayıtlarından tamamla. Reklam/analitik/hesap eklenirse hem web politikasını hem oyundaki politika ve Store beyanlarını birlikte güncelle. Bu paket Store kabulü veya hukuki uygunluk sertifikası değildir.
