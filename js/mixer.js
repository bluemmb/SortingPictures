
// get a random value from [l..r] boundary
function getRandom( l , r )
{
    var d = r - l + 1;
    return Math.floor( Math.random() * d ) + l;
}


/*
class Mixer
	
	This class gets two sorted array of objects and tries to mix them together, with inserting
	the second ones objects in first ones.
	
	The algorithm for merging two arrays is like doing Parallel Binary Searches.
	
	We have a valid boundary for each of the objects in the second array and we are trying to insert
	them into the first array with doing binary search. But result of a comparison can also effect the 
	others valid boundary.
	When all the boundaries turned to a point, we are done.
	
	Note :	We can use SegmentTree for keeping the valid boundaries, but because of the 
			very small number of the objects it is not necessary.
*/


// Constructor of the class ( It will insert the inp2 in inp1 )
function Mixer( inp1 , inp2 )
{
    // Initialize internal arrays
    this.A = []; this.B = [];
    this.n = inp1.length; this.m = inp2.length;
    for ( var val in inp1 ) this.A.push( inp1[val] );
    for ( var val in inp2 ) this.B.push( inp2[val] );
    
    // Create a Bucket from unfinished indices ( at first all of them are unfinished )
    var b = [];
    for ( var i=0 ; i<this.m ; i++ ) b.push( i );
    this.bucket = new Bucket( b );
    
    // Save valid boundaries for each element of second array, for inserting in the first one
    this.L = new Array( this.m ).fill( 0 );
    this.R = new Array( this.m ).fill( this.n-1 );
    
    // MetaData
    this.waitingForReply = false;
    this.lastIndexFrom_A;
    this.lastIndexFrom_B;
}


// Checking whether we are done or not ?
Mixer.prototype.isDone = function()
{
    for ( var i=0 ; i<this.bucket.size ; i++ )
    {
        var ind = this.bucket.bucket[i];
        if ( this.L[ind] <= this.R[ind] )
            return false;
        else
        {
            this.bucket.remove( i );
            i--;
        }
    }
    return true;
};


// Check whether a single object has found his position or not ?
Mixer.prototype.elementIsFinished = function( i )
{
    return (this.L[i] > this.R[i]);         // if L[i] exceeds R[i], This means that we have found it's position
};


// Requesting for the next competitors
Mixer.prototype.next = function()
{
    // find a not-finished element
    var index = undefined;
    while ( this.bucket.isEmpty() == false && index == undefined )
    {
        var t = this.bucket.get();
        var ind = t.value;
        var pos = t.index;
        
        if ( this.elementIsFinished( ind ) == false )
            index = ind;
        else
            this.bucket.remove( pos );
    }
    
    // if there is no one remained. Our job is Done.
    if ( index == undefined )
        return undefined;
    
    // find competitor from first array
    var left = this.L[index] , right = this.R[index] , dist = right - left /* + 1*/;
    var lg = (dist>=1) ? (Math.floor( Math.log2( dist ) )) : (0);
    
    var mid  = Math.floor( ( left + right ) / 2 ); // + getRandom( -lg , lg ) ;
    mid = Math.max( mid , left ); 
    mid = Math.min( mid , right );
    
    // save logs for reply function and return competitiors
    this.waitingForReply = true;
    this.lastIndexFrom_A = mid;
    this.lastIndexFrom_B = index;
    return { first : this.A[mid] , second : this.B[index] };
};


// Reply to the last comparison request
Mixer.prototype.reply = function( c )       // c='>' ( Ai > Bi ) , c='<' ( Ai < Bi )
{
    if ( this.waitingForReply == false ) return false;
    if ( !(c=='>' || c=='<') ) return false;
    
    var iA = this.lastIndexFrom_A;
    var iB = this.lastIndexFrom_B;
    
    if ( c == '>' )                  // Ai > Bi
    {
    	// update the boundaries
        this.R[iB] = iA - 1;
        for ( var i=iB-1 ; i>=0 ; i-- )
            this.R[i] = Math.min( this.R[i] , this.R[iB] );
    }
    else // if ( c == '<' )          // Ai < Bi
    {
    	// update the boundaries
        this.L[iB] = iA + 1;
        for ( var i=iB+1 ; i<this.m ; i++ )
            this.L[i] = Math.max( this.L[i] , this.L[iB] );
    }
    
    this.waitingForReply = false;
    return true;
};


// Get the result of the Mixer ( after finishing it's job )
Mixer.prototype.getMixerResult = function()
{
    // We must be Done
    if ( this.isDone() == false ) return undefined;
    
    // Create the mixed list with Two Pointers method
    var res = [];
    var i = 0 , j = 0;
    var n = this.n , m = this.m;
    
    while ( i < n && j < m )
    {
        var pos1 = i , pos2 = this.R[j];
        if ( pos1 <= pos2 )
        {
            res.push( this.A[i] );
            i++;
        }
        else
        {
            res.push( this.B[j] );
            j++;
        }
    }
    
    while ( i < n )
    {
        res.push( this.A[i] );
        i++;
    }
    
    while ( j < m )
    {
        res.push( this.B[j] );
        j++;
    }
    
    return res;
};

// # for debug
Mixer.prototype.printBounds = function( c )
{
    var out = "";
    
    out += "L : ";
    for ( var i=0 ; i<this.m ; i++ ) out += this.L[i] + " ";
    out += "\n";
    
    out += "R : ";
    for ( var i=0 ; i<this.m ; i++ ) out += this.R[i] + " ";
    out += "\n";
    
    console.log( out );
};


