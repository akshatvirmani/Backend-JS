var c;
let a=[2,3,4,6,8,16,34,27,9];
for(let i of a)
{
    for(let j=1;j<=i;j++)
    {
        c=0;
        if(i%j==0)
        {
            for(let k=1;k<=j;k++)
            {
                if(j%k==0)
                {
                    c++;  
                }
            }
           if(c==2){
               let b=j*j;
               console.log(b);
           }
        }
    }
    console.log('----');
}