from pathlib import Path
import json,re
p=Path(__file__).parent
text=(p/'source-reference.txt').read_text()
heads=[('GA1','GA1: Disarmament and Weapons:'),('GA2','GA2: Economic and Financial Committee:'),('GA3','GA3: Humanitarian and Cultural'),('GA4','GA4: Special Political and Decolonization'),('GA5','GA5: Administration and Budgetary Matters'),('GA6','GA6: Legal:'),('ECOSOC','Economic and Social (ECOSOC)'),('HRC','Human Rights Council (HRC)'),('SC','Security Council'),('HSC Recent','HSC RECENT'),('HSC Ancient','HSC ANCIENT:'),('WHO','World Health Organisation'),('UNICEF',"United Nations Children's Fund (UNICEF)"),('WFP','WFP (World Food Programme)'),('UNDP','UNDP (United Nations Development Program)'),('UNIDIR','UNIDIR (United Nations Institute for Disarmament Research)'),('SDG 9','SDG 9 (Industry, Innovation and Infrastructure)'),('SDG 6','SDG 6 (Clean Water and Sanitation)'),('Crisis','Crisis Committee')]
committees=[]
for i,(code,head) in enumerate(heads):
 start=text.index(head)+len(head)
 end=text.index(heads[i+1][1],start) if i+1<len(heads) else len(text)
 chunk=re.sub(r'DCMUN XVIII\s*Committee Issues','',text[start:end]).strip(':\n ')
 issues=[]
 for line in chunk.splitlines():
  line=line.strip().replace('\x02','-')
  if not line:continue
  if re.match(r'^(Addressing|Regulating|Preventing|Measures|Assessing|Mitigating|Implementing|De-criminalizing|Determining|Examining|Deploying|Reforming|Combating|Ensuring|Reassessing|Balancing|Supporting)\b',line):issues.append(line)
  elif issues:issues[-1]+=' '+line
 committees.append(dict(code=code,name=head.split(': ',1)[-1].rstrip(':'),headChair='',deputyChairs=[],room='',issues=[dict(title=t,chair='',pdf='') for t in issues]))
config={'edition':'XVIII','theme':'','welcome':'Welcome to Doha College Model United Nations. DCMUN brings delegates together to research global challenges, consider different perspectives and work towards shared solutions. Arrive curious, listen carefully and give your ideas a voice.','map':{'image':'','pdf':''},'committees':committees,'executives':[{'name':'','role':'','message':''}],'schedule':[{'day':'Thursday','date':'5 November','events':[{'time':'15:45–19:00','title':'Conference programme','venue':'Doha College · Al Wajba Campus'}]},{'day':'Friday','date':'6 November','events':[{'time':'08:45–17:30','title':'Conference programme','venue':'Doha College · Al Wajba Campus'}]},{'day':'Saturday','date':'7 November','events':[{'time':'08:45–12:00','title':'Morning programme','venue':'Doha College · Al Wajba Campus'},{'time':'15:30–18:00','title':'Afternoon programme','venue':'The Mondrian Hotel'}]}]}
(p/'dist/content.js').write_text('// Edit this file to update the delegate guide. Empty PDF fields show “Coming soon”.\nwindow.DCMUN = '+json.dumps(config,indent=2,ensure_ascii=False)+';\n')
print(f'{len(committees)} committees, {sum(len(c["issues"]) for c in committees)} issues')
