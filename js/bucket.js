
/*
class Bucket

	An adopted version of well-known data structure "Bucket" for
	using in this project.
*/

// Constructor of the class
function Bucket( inp )
{
	// keeps an array of objects inside the class
    this.bucket = [];    	
    // and the number of them
    this.size   = inp.length;
    
    for ( var val in inp )
        this.bucket.push( inp[val] );
}


// check whether our bucket is empty or not ?
Bucket.prototype.isEmpty = function()
{
    return this.size == 0;    
};


// get a random object and it's index from bucket
Bucket.prototype.get = function()
{
    if ( this.isEmpty() ) return undefined; 
    
    var ind = Math.floor(Math.random() * this.size);
    return { index : ind , value : this.bucket[ind] };
};


// remove specific index from bucket if exists
Bucket.prototype.remove = function( ind )
{
    var sz = this.size;
    if ( ind >= sz ) return false;
    
    // we move the last object to the empty place
    // and decreas the number of objects in bucket
    this.bucket[ind] = this.bucket[sz-1];
    this.size--;
    
    return true;
};


// add new object to the end of the bucket
Bucket.prototype.add = function( x )
{
    var sz = this.size;
    this.bucket[ sz ] = x;
    this.size++;
    return true;
};


// # for debug
Bucket.prototype.print = function()
{
    console.log( "Bucket Size = " + this.size + "\n{" );
    for ( var i=0 ; i<this.size ; i++ )
        console.log( "\t" + this.bucket[i] );
    console.log( "}" );
};
