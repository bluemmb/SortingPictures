
/*
class Sorter

	This class is the main class of the algorithm.
	It gets the inputs, manages them with pairing them for Mixers, manages the Mixers, ...
*/


// Constructor of the class
function Sorter()
{
	// Set of the Mixers that aren't finished
    this.mixers  = new Bucket( [] );
    // Set of the Sorted Objects, waiting for get paired and involved
    this.waiting = new Bucket( [] );
    
    // MetaData
    this.waitingForReply = false;
    this.lastMixer = undefined;
    this.lastMixerPos = undefined;
}


// Add new object to the waiting list
Sorter.prototype.add = function( val )  // val must be an array
{
    this.waiting.add( val );
};


// Pairs Sorted Lists and puts them in Mixers list
Sorter.prototype.checkWaiting = function()
{
    // If there are at least 2 lists waiting for mix , Pair them and add them to the mixers list
    while ( this.waiting.size >= 2 )
    {
        // Pick 2 random lists
        var x = this.waiting.get();
        this.waiting.remove( x.index );
        var y = this.waiting.get();
        this.waiting.remove( y.index );
        
        // First one is better to be bigger than the second one ! ( so important )
        x = x.value;
        y = y.value;
        if ( x.length < y.length )
        {
            var z = x;
            x = y;
            y = z;
        }
        
        // Create a Mixer from them and add them to the mixers list
        this.mixers.add( new Mixer( x , y ) );
    }
};


// Check whether we are done or not ?
Sorter.prototype.isDone = function()
{
    return (this.mixers.size == 0) && (this.waiting.size <= 1);
};


// Requesting for the next competitiors
Sorter.prototype.next = function()
{
    // Pair members in waiting list and add them to mixers bucket
    this.checkWaiting();
    
    // Check whether we are done or not
    if ( this.isDone() ) return undefined;
    
    // Get a Mixer and get Next competitiors from it
    var mix = this.mixers.get();
    this.lastMixer = mix.value , this.lastMixerPos = mix.index;
    this.waitingForReply = true;
    
    return this.lastMixer.next();
};


// Reply to the last comparison request
Sorter.prototype.reply = function( c )
{
    // Check whether we are expecting a reply or not
    if ( this.waitingForReply == false ) return false;
    
    // Check for valid reply
    if ( !(c == '>' || c == '<') ) return false;
    
    // Send reply to the Mixer and Check it's status
    this.lastMixer.reply( c );
    if ( this.lastMixer.isDone() )
    {
        var res = this.lastMixer.getMixerResult();
        this.mixers.remove( this.lastMixerPos );
        this.add( res );
    }
    
    this.waitingForReply = false;
    return true;
};


// Get the result of the Sorter ( after finishing it's job  )
Sorter.prototype.getSorterResult = function()
{
    if ( this.isDone() == false ) return undefined;
    if ( this.waiting.size == 0 ) return [];
    return this.waiting.bucket[0];
};

