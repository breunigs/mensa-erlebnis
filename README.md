Mensa-Erlebnis
==============

Warum?
------

Das Studentenwerk hat ein eigenes [Lob und Tadel Formular](http://www.studentenwerk.uni-heidelberg.de/zv_portal/zv?zv_action=CH_PAGE&zv_value=SWD_HD_Essen_HD_LobTadel), das sie aber kaum bewerben und das sich mit dem Handy nicht gut benutzen lässt. Wir finden einen einfachen Rückkanal wichtig, damit die Mensa sich verbessern kann.

Auf [allesdreck.de](http://allesdreck.de) findet ihr auch den heutigen Speiseplan. Die Seite ist aber von jemand anderem.


Datenschutz
-----------

Ich bin nicht das Studentenwerk, aber ich missbrauche Deine Daten nicht. Genau genommen laufen sie gar nicht über den Server, sondern werden direkt an das Studentenwerk gesendet. *Diese* Seite speichert auch Deine IP Adresse nicht, allerdings werden einige Sachen von einem fremden Netzwerk geladen. Über dieses weiß ich nichts, aber es sollte Deine Eingaben auch nicht erhalten.


Installation / Patches
----------------------

Die `updater.rb` muss regelmäßig per Cron-Job aufgerufen werden. Das Front-End läuft komplett im Browser und daher reicht eine statische Auslieferung. Bevor Du konkurrierende Seiten aufsetzt wäre es uns jedoch lieb, wenn Du stattdessen erst hier verbesserst. Hänge Patches an den Issue Tracker oder so. Wenn Du eine komplett neue Variante hast, dann melde Dich. Im Zweifel leiten wir die mensaerlebnis.uni-hd.de Adresse um.

Beim Testen empfiehlt es sich in der `magic.js` diese Zeilen auszukommentieren:

```javascript
$("iframe").attr("src", "form.html");
```

und

```javascript
i.find("input[name=SW_LOB_SUBJECT]").val("Mein Mensa-Erlebnis");
```

Dann weist der Server des StuWes die Anfrage zurück, da der Betreff fehlt. Außerdem kann man sich anschauen, ob Texte übernommen wurden und sonst alles geklappt hat.
