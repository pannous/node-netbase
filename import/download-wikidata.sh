cd import
mkdir wikidata
cd wikidata

DATE=20160104
wget -N https://tools.wmflabs.org/wikidata-exports/rdf/exports/$DATE/wikidata-terms.nt.gz
wget -N https://tools.wmflabs.org/wikidata-exports/rdf/exports/$DATE/wikidata-properties.nt.gz
wget -N https://tools.wmflabs.org/wikidata-exports/rdf/exports/$DATE/wikidata-instances.nt.gz
wget -N https://tools.wmflabs.org/wikidata-exports/rdf/exports/$DATE/wikidata-simple-statements.nt.gz
wget -N https://tools.wmflabs.org/wikidata-exports/rdf/exports/$DATE/wikidata-sitelinks.nt.gz
wget -N https://tools.wmflabs.org/wikidata-exports/rdf/exports/$DATE/wikidata-statements.nt.gz
wget -N https://tools.wmflabs.org/wikidata-exports/rdf/exports/$DATE/wikidata-taxonomy.nt.gz

if [ $APPLE ]; then
    alias zcat=gzcat
fi
zcat wikidata-terms.nt.gz| grep "@de ." | \
sed 's|http://www.wikidata.org/entity/||' | \
sed 's|http://www.w3.org/2000/01/rdf-schema#||' | \
sed 's|http://www.w3.org/2004/02/skos/core#||' | \
sed 's|http://schema.org/||' > wikidata-terms.de.nt

zcat wikidata-terms.nt.gz| grep "@en ." | \
sed 's|http://www.wikidata.org/entity/||' | \
sed 's|http://www.w3.org/2000/01/rdf-schema#||' | \
sed 's|http://www.w3.org/2004/02/skos/core#||' | \
sed 's|http://schema.org/||' > wikidata-terms.en.nt