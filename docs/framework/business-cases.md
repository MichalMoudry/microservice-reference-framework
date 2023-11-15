# Business případy pro mikroslužby
---
Tato část obsahuje popisy produkčních systémů, které využívají architektonický styl mikroslužeb. Samotný popis vychází z realizovaných rozhovorů v rámci mé diplomové práci.

## Business případ 1
### Doména
Systém obsahuje několik aplikací, ale hlavní je poskytování pluginu pro (<abbr title="business-to-business">b2b</abbr>) zákazníky pro zajištění kompletní checkout flow pro platby, tedy ve své podstatě jde o plugin poskytující platební bránu.
### Důvod pro využití mikroslužeb
Projekt byl původně jeden velký monolit.

Hlavní důvod pro migraci na architekturu mikroslužeb byla velikost monolitu, kdy vývojáři v týmu se v řešení  ztráceli, dále také už v týmu nebyl nikdo, kdo by rozuměl celému řešení. Velikost řešení měla negativní dopad na rychlost vývoje nových funkcí systému, přičemž zákazník konzistentně přicházel s novými nápady, resp. funkcemi systému (a kolikrát ve formě pokusů).

Další aspekt byla škálovatelnost systému, kdy v SW řešení byly částí, které jsme chtěli škálovat více a některé ne, kdy u mikroslužeb lze škálovat části zvlášť nezávisle na zbytku systému.

Výhodou mikroslužeb je také aplikace nových technologií a frameworků, kdy nové služby v systému vytváříme na nové verzi .NET, přičemž lze efektivně dělat aktualizaci verze .NET u existujících služeb, protože jsou menší celky. U menších služeb se také lépe řešení problémy a aktualizací závislostí, kdy u monolitů člověk musí aktualizovat všechny části systému. Využití nejnovějších technologií má také pozitivní dopad na spokojenost týmu, protože každý vývojář chce pracovat s novinkami než se zabývat legacy systémy.

Další pozitivní aspekt mikroslužeb je i v rámci pochopení domény či systému, kdy je pro vývojáře snazší pochopit menší část systému než se snažit zakomponovat kód do jednoho obrovského celku.
Ve spojení s možností využití nových technologií a dekompozice systému na menší části vede ke spokojenějším a produktivnějším vývojářům na projektu.

> Zde lze vidět dopad nezávislosti služeb (viz [Charateristika nezávislosti](./framework/microservices-characteristics?id=nezávislost-služeb-a-jejich-nasazování)) v rámci této architektury.

Příkladem využití nových technologií byla možnost využít různorodé systémy pro ukládání dat. Většinou používáme SQL datábaze, ale třeba také uložiště Azure Blob Storage nebo Azure Cognitive Search pro vyhledávání ve velkém množství dat.


### Nevýhody využití mikroslužeb

> V softwarových architekturách nikdy nejsou jen přínosy, ale vše má své výhody a nevýhody. Je tedy třeba při analýze vhodně vybrat architekturu, jejíž přínosy jsou hodnotnější pro projekt, a s nevýhodami ten projekt může žít.

Jedna z hlavních nevýhod je spojena s komunikací přes síť. U monolitů komponenty mezi sebou komunikují in-process, tedy vše je nekonečně spolehlivé a rychlé. Jakmile se komponenty rozdělí a postaví se mezi ně síť, tak odezva není nulová a jsou tam možné výpadky (tzn. komunikace nemá 100% garantovanou spolehlivost) a s tím vším se při návrhu systému musí počítat. Ve výsledku člověk musí uvažovat různé retry patterny už při návrhu.

U mikroslužeb je třeba dbát na doménu služeb, přičemž by měla mít malé rozhraní a minimálně komunikovat s okolím. Příkladem je třeba, že pokud nějaká uživatelská akce nebo externí API volání projede přes 15 mikroslužeb, tak je v návrhu něco špatně. Tedy služby by měly mít jasně definové a co nejvíce stabilní rozhraní, aby nedocházelo k častým změnám kontraktů, což vyžaduje větší množství koordinace při nasazování služeb.

Další problém je ve správě dat, kdy jednou ze zásad mikroslužeb je, že nesmí mezi sebou sdílet žádná data. Tedy pokud nějaká služba potřebuje data, tak je třeba jí ty data poslat. U posílání dat jsou dvě možnosti pro data dynamické a statičtější  povahy. Příkladem dynamických dat je u nás třeba nákup, který putuje celým systémem. U dynamických dat je třeba poslat všechny data, které služby potřebují. U statičtějších dat jde využít replikační mechanismus (např. přes service bus ), kdy služby si udržují svojí vlastní lokální kopii. Příkladem replikace statičtějších dat je u nás konfigurace partnerů, kdy jedna služba slouží jako zdroj pravdy, přičemž pokud dojde k aktualizaci konfigurace, tak tu změnu publikuje na service busu a všechny relevantní služby si tu aktualizaci převezmou, a aktualizují si svojí lokální kopii.

> Zde lze vidět možné dopady _decentralizované správy dat_ (viz [Decentralizovaný governance a správa dat](./framework/microservices-characteristics?id=decentralizovaný-governance-a-správa-dat)) v systémech založených na mikroslužbách. Zde lze také pozorovat praktickou aplikaci _asynchronní komunikace_ (viz [Nezávislost služeb a jejich nasazování](./framework/microservices-characteristics?id=nezávislost-služeb-a-jejich-nasazování)).

U mikroslužeb je také velký problém implementovat transakci přes několik služeb, což velice komplexní záležitost, které se snažíme vyhýbat, protože pro to neexistuje ideální řešení. U distribuovaných systémů nelze dosáhnout všech ACID vlastností, což je velká výhoda u monolitických systémů. Byl zvažován Saga pattern, ale zase neexistuje ideální řešení a člověk vždycky něco musí obětovat. Dále u konzistence dat systém využívá eventuální konzistenci dat, např. u replikace konfigurace partnerů se ty služby eventuálně dostanou do stavu, kdy mají aktuální konfiguraci, ale nikdy to nebude ve stejný čas. Samozřejmě pro to existuje pattern (konkrétně outbox pattern), který s tím pomůže, ale to je práce navíc oproti monolitům.

!> V této části je uvedena problematika transakcí v mikroslužbách.

### Zvažované alternativy architektury
Namísto mikroslužeb byl uvažována tzv. vertical slice architektura, jejíž výhodou by byla minimalizace zásahů do částí systému, které by měly neočekávané změny.
### Podpora ze strany zákazníka
Na základě prezentace konceptu, výhod a nevýhod mikroslužeb a plánu pro postupnou migraci na mikroslužby, kdy nové funkce budou implementovány v rámci mikroslužeb, tak migrace byla bez problému odsouhlasena ze strany businessu. S přesunem na mikroslužby byl spojen přesun z on-premises do cloudového prostředí, kde je snazší a rychlejší implementovat tuto architekturu.
### Náklady jako faktor při rozhodování
Vzhledem k přesunu z on-premise, tak náklady na přesun na mikroslužby nebyl tak důležitý, tedy náklady nebyly kritickou částí při rozhodování.
Samozřejmě po určité době bylo třeba řešit/optimalizovat provozní náklady u některých komponent systému. Konkrétně šlo optimalizace spojené s logováním,
kdy cena je spojená s množstvím logů, kdy je třeba možné udělat chybu u služby, která bude logovat víc než by měla. Logování je překvapivě nákladná položka,
přičemž ta lze také dobře optimalizovat z pohledu nákladů a provozních potřeb.
### Vzory aplikované během vývoje
- Outbox pattern
- Integration event pattern
- Pub-sub pattern
- Retry a circut-breaker pattern
- Gateway pattern
### Použité technologie
- .NET + C#
- Elm (pro některé frontend aplikace)
- Azure Service Bus
- Azure App Insights
- Azure Blob Storage
- Azure AD
