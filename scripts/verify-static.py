"""Validate the built site's routes, local links, assets, IDs and content boundary.
Run after npm run build. No network calls or third-party dependencies.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import re

root=Path('dist')
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.images=[];self.headings=[];self.mail=False;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if tag in ('h1','h2','h3'):self.headings.append(tag)
  if tag in ('img','source') and a.get('src'):self.images.append(a['src'])

pages={f:Page(f.read_text()) for f in root.rglob('*.html')}
errors=[]
def resolve(path):
 f=root/unquote(path).lstrip('/')
 if f.is_file():return f
 if (f/'index.html').is_file():return f/'index.html'
 return None
for path,page in pages.items():
 dup=[k for k,v in Counter(page.ids).items() if v>1]
 if dup:errors.append(f'{path}: duplicate IDs {dup}')
 # Redirect stubs deliberately contain no story or mail link.
 if 'main-content' in page.ids:
  if page.headings.count('h1')!=1:errors.append(f'{path}: expected one H1')
  if not any(h.startswith('mailto:') for h in page.links):errors.append(f'{path}: missing static email')
 for href in page.links+page.images:
  u=urlsplit(href)
  if u.scheme or u.netloc:continue
  target=path if not u.path else resolve(u.path) if u.path.startswith('/') else path.parent/u.path
  if not target or not target.exists():errors.append(f'{path}: missing {href}');continue
  if u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:
   errors.append(f'{path}: missing fragment {href}')
for route in ['/','/work/','/work/syncareer/','/work/sessionbook/','/work/koranco/','/lab/','/profile/','/about/','/contact/','/case-study/']:
 if not resolve(route):errors.append(f'Missing route: {route}')
# Preserve the supplied résumé byte-for-byte and keep private credential originals out of output.
assert (root/'Stephen-Mensah-Resume.pdf').read_bytes()==Path('public/Stephen-Mensah-Resume.pdf').read_bytes()
for source in Path('source-material/credentials').glob('*'):
 if any(source.read_bytes()==f.read_bytes() for f in root.rglob('*') if f.is_file() and f.stat().st_size==source.stat().st_size):errors.append(f'Private credential original leaked into build: {source.name}')
if errors:
 print('\n'.join(errors));raise SystemExit(1)
assets=list((root/'_astro').glob('*'))
for ext in ['.js','.css','.woff2']:
 selected=[f for f in assets if f.suffix==ext]
 print(f'{ext}: {len(selected)} files, {sum(f.stat().st_size for f in selected):,} bytes (uncompressed total across all routes)')
print(f'Static checks passed: {len(pages)} pages/redirects, local links and fragments, unique IDs, static email, résumé bytes, private originals excluded.')
