"""Validate the generated storefront as a deployable set of real pages."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json, unittest
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.images=[];self.ids=set();self.h1=0;self.canonical=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag=='img':self.images.append(a)
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
class SiteTests(unittest.TestCase):
 def test_pages_have_valid_links_images_headings_and_canonicals(self):
  files=list(DIST.rglob('*.html'));self.assertGreaterEqual(len(files),24)
  pages={p:Page(p.read_text()) for p in files}
  for file,page in pages.items():
   with self.subTest(page=str(file.relative_to(DIST))):
    self.assertEqual(page.h1,1);self.assertEqual(len(page.canonical),1)
    self.assertIn(urlsplit(page.canonical[0]).scheme,['http','https'])
    for image in page.images:
     self.assertTrue(image.get('alt'));self.assertTrue((DIST/image['src'].lstrip('/')).is_file())
    for link in page.links:
     url=urlsplit(link)
     if url.scheme or url.netloc:continue
     target=DIST/url.path.lstrip('/') if url.path else file
     if target.is_dir():target=target/'index.html'
     self.assertTrue(target.exists(),link)
     if url.fragment:self.assertIn(url.fragment,pages[target].ids,link)
 def test_covers_are_representative_and_original_photos_stay_inside_products(self):
  original={name for p in json.loads((ROOT/'catalog.json').read_text()) for name in p.get('actualImages',[])}
  for file in [DIST/'index.html',*(DIST/'shop').rglob('*.html')]:
   for image in Page(file.read_text()).images:self.assertNotIn(Path(image['src']).name,original)
  product=Page((DIST/'products/walnut-kernels/index.html').read_text())
  self.assertEqual(Path(product.images[0]['src']).name,'web-walnut-kernels.jpg')
  self.assertIn('walnuts.jpg',[Path(x['src']).name for x in product.images])
 def test_repository_build_is_self_contained(self):
  self.assertNotIn('/private/tmp', (ROOT/'build.py').read_text())
  for p in json.loads((ROOT/'catalog.json').read_text()):self.assertTrue((ROOT/'assets'/p['image']).is_file())
if __name__=='__main__':unittest.main()
