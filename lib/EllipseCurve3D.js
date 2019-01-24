function EllipseCurve3D( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

	THREE.EllipseCurve.call( this );

	this.type = 'EllipseCurve3D';

	this.aX = aX || 0;
	this.aY = aY || 0;

	this.xRadius = xRadius || 1;
	this.yRadius = yRadius || 1;

	this.aStartAngle = aStartAngle || 0;
	this.aEndAngle = aEndAngle || 2 * Math.PI;

	this.aClockwise = aClockwise || false;

	this.aRotation = aRotation || 0;

}

EllipseCurve3D.prototype = Object.create( THREE.EllipseCurve.prototype );
EllipseCurve3D.prototype.constructor = EllipseCurve3D;

EllipseCurve3D.prototype.isEllipseCurve3D = true;

EllipseCurve3D.prototype.getPoint = function ( t, optionalTarget ) {

	var point = optionalTarget || new THREE.Vector3();

	var twoPi = Math.PI * 2;
	var deltaAngle = this.aEndAngle - this.aStartAngle;
	var samePoints = Math.abs( deltaAngle ) < Number.EPSILON;

	// ensures that deltaAngle is 0 .. 2 PI
	while ( deltaAngle < 0 ) deltaAngle += twoPi;
	while ( deltaAngle > twoPi ) deltaAngle -= twoPi;

	if ( deltaAngle < Number.EPSILON ) {

		if ( samePoints ) {

			deltaAngle = 0;

		} else {

			deltaAngle = twoPi;

		}

	}

	if ( this.aClockwise === true && ! samePoints ) {

		if ( deltaAngle === twoPi ) {

			deltaAngle = - twoPi;

		} else {

			deltaAngle = deltaAngle - twoPi;

		}

	}

	var angle = this.aStartAngle + t * deltaAngle;
	var x = this.aX + this.xRadius * Math.cos( angle );
	var y = this.aY + this.yRadius * Math.sin( angle );

	if ( this.aRotation !== 0 ) {

		var cos = Math.cos( this.aRotation );
		var sin = Math.sin( this.aRotation );

		var tx = x - this.aX;
		var ty = y - this.aY;

		// Rotate the point about the center of the ellipse.
		x = tx * cos - ty * sin + this.aX;
		y = tx * sin + ty * cos + this.aY;

	}

	return point.set( x, y, 0 );

};


// export { EllipseCurve3D };
THREE.EllipseCurve3D = EllipseCurve3D;
