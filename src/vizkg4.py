# import VizKG
import VizKG.visualize as VKG

sparql_query = """
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?docName (COUNT(?component) as ?componentCount)
WHERE {
  ?doc a o:Peraturan .
  ?component o:bagianDari* ?doc .
  BIND(REPLACE(REPLACE(STR(?doc), "https://example.org/lex2kg/", ""), "/", "-") as ?docName) .
}
GROUP BY ?docName
ORDER BY DESC(?componentCount)
LIMIT 5
"""

url = "http://127.0.0.1:3030/lex2kg/sparql"
bubble = VKG(sparql_query=sparql_query, sparql_service_url=url, chart='BarChart')
bubble.plot()