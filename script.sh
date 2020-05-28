ls -al

input=3
tic=`date +%S`
elap_time=0

while [ "$elap_time" -le "$input" ]; 
do
    toc=`date +%S`
    elap_time=`expr $toc - $tic`
done

echo "\nTIME ELAPSED"